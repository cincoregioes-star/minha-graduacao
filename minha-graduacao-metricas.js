/* Minha Graduação: rótulos, informação de oferta e métricas opt-in.
   Não altera conteúdo de disciplinas, usuários, provas, notas ou progresso. */
(function(){
  "use strict";
  const FREE_ID="s1d1";
  const CONSENT_KEY="mg-uso-consent-2026-v1";
  const SESSION_KEY="mg-uso-sessao-2026-v1";
  const cfg=window.MG_SUPABASE||{};
  const configured=typeof cfg.url==="string"&&/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.url)&&typeof cfg.publishableKey==="string"&&/^sb_publishable_/.test(cfg.publishableKey);
  function cleanSection(section){return String(section||"").replace(/[^a-z0-9_\-]/gi,"").slice(0,36)}
  function getSession(){
    try{
      let id=sessionStorage.getItem(SESSION_KEY);
      if(!id){id=(crypto&&crypto.randomUUID)?crypto.randomUUID():null;if(id)sessionStorage.setItem(SESSION_KEY,id)}
      return id;
    }catch(_e){return null}
  }
  function consented(){try{return localStorage.getItem(CONSENT_KEY)==="sim"}catch(_e){return false}}
  function track(type,section,courseId){
    if(!configured||!consented())return;
    const sid=getSession();if(!sid)return;
    const event={session_id:sid,event_type:String(type).slice(0,40),section:cleanSection(section),course_id:courseId?cleanSection(courseId):null};
    fetch(cfg.url.replace(/\/$/,"")+"/rest/v1/mg_usage_events",{
      method:"POST",headers:{"apikey":cfg.publishableKey,"Content-Type":"application/json","Prefer":"return=minimal"},
      body:JSON.stringify(event),keepalive:true,credentials:"omit"
    }).catch(()=>{});
  }
  function infoMarkup(){
    return '<div class="mg-info" role="note"><div class="mg-info-icon" aria-hidden="true">🎓</div>'+
      '<div class="mg-info-text"><strong>Simulador de graduações — sua primeira disciplina é grátis!</strong>'+
      '<span>Experimente gratuitamente a primeira disciplina de Ciências Contábeis, com unidades de estudo e atividades. As demais compõem uma trilha demonstrativa em desenvolvimento. É estudo independente: não é faculdade credenciada e não emite diploma universitário.</span></div>'+
      '<button type="button" class="btn small" onclick="openCourse(\'s1d1\')">Estudar grátis →</button></div>';
  }
  function decorate(){
    const home=document.getElementById("home"),curriculum=document.getElementById("curriculum");
    if(home&&!home.querySelector(".mg-info"))home.insertAdjacentHTML("afterbegin",infoMarkup());
    if(curriculum&&!curriculum.querySelector(".mg-info")){
      const h=curriculum.querySelector(".heading");
      if(h)h.insertAdjacentHTML("afterend",infoMarkup());else curriculum.insertAdjacentHTML("afterbegin",infoMarkup());
    }
    const auth=document.querySelector(".auth-desc");
    if(auth&&!auth.querySelector(".mg-auth-disclaimer"))auth.insertAdjacentHTML("beforeend",'<span class="mg-auth-disclaimer" style="display:block">Plataforma independente de simulação acadêmica, sem diploma de graduação. Primeira disciplina gratuita.</span>');
  }
  function decorateCards(){
    if(typeof window.courseCard!=="function")return;
    const original=window.courseCard;
    if(original.__mgDecorated)return;
    function wrapped(c){
      const card=original(c);
      const free=c.id===FREE_ID;
      const label=free?'<span class="mg-card-label mg-card-free">✓ Primeira disciplina gratuita</span>':'<span class="mg-card-label">Trilha demonstrativa</span>';
      return card.replace('<article class="course">','<article class="course '+(free?'course-gratis':'')+'">'+label);
    }
    wrapped.__mgDecorated=true;
    window.courseCard=wrapped;
    if(typeof window.drawCourses==="function")window.drawCourses();
    if(typeof window.drawLearning==="function")window.drawLearning();
  }
  function wrapEvents(){
    if(typeof window.navigate==="function"){
      const old=window.navigate;
      window.navigate=function(section){const result=old.apply(this,arguments);track("view",section,null);return result};
    }
    if(typeof window.openCourse==="function"){
      const old=window.openCourse;
      window.openCourse=function(id){const result=old.apply(this,arguments);track("course_open","classroom",id);return result};
    }
    if(typeof window.markTopic==="function"){
      const old=window.markTopic;
      window.markTopic=function(){const result=old.apply(this,arguments);track("topic_change","classroom",null);return result};
    }
  }
  function privacy(){
    if(!configured)return;
    const footer=document.querySelector("footer.footer");
    if(footer&&!document.getElementById("mgPrivacySettings")){
      const control=document.createElement("button");
      control.id="mgPrivacySettings";control.type="button";control.className="mg-privacy-settings";
      control.textContent="Preferências de estatísticas";
      control.onclick=()=>showConsent();
      footer.appendChild(control);
    }
    let stored=null;try{stored=localStorage.getItem(CONSENT_KEY)}catch(_e){}
    if(stored===null)showConsent();
  }
  function showConsent(){
    if(!configured)return;
    const prior=document.getElementById("mgConsentBox");if(prior)prior.remove();
    const box=document.createElement("div");box.id="mgConsentBox";box.className="mg-privacy-box";
    box.innerHTML='<strong>Estatísticas de uso opcionais</strong><p>Se você permitir, a plataforma registra visitas e abertura de áreas e disciplinas, com identificador temporário por aba. Não envia seu nome, senha, foto, notas ou respostas das avaliações ao Supabase. Você pode mudar sua escolha no rodapé.</p><div class="mg-privacy-actions"><button type="button" id="mgDecline">Agora não</button><button type="button" class="mg-accept" id="mgAccept">Permitir</button></div>';
    document.body.appendChild(box);
    box.querySelector("#mgDecline").onclick=()=>{try{localStorage.setItem(CONSENT_KEY,"nao")}catch(_e){}box.remove()};
    box.querySelector("#mgAccept").onclick=()=>{try{localStorage.setItem(CONSENT_KEY,"sim")}catch(_e){}box.remove();track("visit","home",null)};
  }
  function init(){
    if(window.__mgEnhancementsDone)return;window.__mgEnhancementsDone=true;
    decorate();decorateCards();wrapEvents();privacy();
    if(consented())track("visit","home",null);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
