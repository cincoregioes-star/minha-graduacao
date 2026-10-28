-- Minha Graduação — Relatórios de uso | Supabase SQL Editor
-- Apenas o responsável pelo projeto deve executar as consultas.
-- Dados anônimos e facultativos (dependem do consentimento do visitante).
-- Fuso: America/Fortaleza.

-- 1) Resumo dos últimos 30 dias
select
 count(*) filter (where event_type='page_view') as visualizacoes_de_tela,
 count(distinct visitor_id) as navegadores_com_consentimento,
 count(distinct session_id) as sessoes,
 count(*) filter (where event_type='course_open') as disciplinas_abertas,
 count(*) filter (where event_type='quiz_complete') as simulados_concluidos,
 count(*) filter (where event_type='assessment_complete') as provas_concluidas
from public.mg_usage_events
where created_at >= now() - interval '30 days';

-- 2) Visualizações por dia (horário de Fortaleza)
select (created_at at time zone 'America/Fortaleza')::date as dia,
 count(*) filter (where event_type='page_view') as telas,
 count(distinct visitor_id) as navegadores,
 count(distinct session_id) as sessoes
from public.mg_usage_events
where created_at >= now() - interval '30 days'
group by 1 order by 1 desc;

-- 3) Quais disciplinas recebem mais atenção
select course_id as disciplina,
 count(*) filter (where event_type='course_open') as aberturas,
 count(*) filter (where event_type='lesson_toggle') as aulas_marcadas,
 count(*) filter (where event_type='quiz_complete') as simulados,
 count(*) filter (where event_type='assessment_complete') as provas
from public.mg_usage_events
where course_id is not null
group by course_id order by aberturas desc, simulados desc;

-- 4) Telas mais consultadas
select page as tela,count(*) as eventos,count(distinct visitor_id) as navegadores
from public.mg_usage_events
group by page order by eventos desc;

-- 5) Eventos mais recentes sem dados de identidade
select created_at,event_type,page,course_id
from public.mg_usage_events
order by created_at desc limit 50;
