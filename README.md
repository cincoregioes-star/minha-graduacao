# Minha Graduação — Simulador educacional

Site: https://cincoregioes-star.github.io/minha-graduacao/

## Plataforma
- Ciências Contábeis: **8 semestres e 48 disciplinas**.
- Aulas, exercícios, simulados, provas e laboratório contábil.
- Cards coloridos, efeito de ampliação e interface responsiva.
- **Primeira disciplina gratuita**. As demais disciplinas permanecem demonstrativas; sem checkout.
- Progresso e login permanecem **locais ao navegador**.
- Não concede diploma superior, reconhecimento do MEC nem habilitação profissional.

## Supabase: coleta de uso conectada (28/10/2026)
Projeto Supabase exclusivo: `minha-graduacao` (`xxfgaeiucwhvlqodzqql`), em São Paulo.

- O `index.html` carrega `mg-supabase-config.js`, que contém somente a URL HTTPS e a chave pública publishable.
- Banco `public.mg_usage_events`, com RLS ativo.
- O visitante precisa clicar **Permitir métricas**; antes disso nada é enviado.
- Eventos: `page_view`, `course_open`, `lesson_toggle`, `quiz_complete` e `assessment_complete`.
- Nenhum nome, senha, foto, resposta de prova nem nota é transmitido. Os IDs de sessão e navegador são pseudônimos.
- Usuários anônimos podem **somente inserir** eventos com campos limitados; não podem consultar, modificar nem apagar os registros.
- Permissões conferidas: RLS ativo, `anon` com inserção e sem leitura. O teste HTTP ponta a ponta no site publicado ainda não foi observado; o registro será confirmado quando um visitante autorizar métricas.

### Consultar os acessos
Abra https://supabase.com/dashboard/project/xxfgaeiucwhvlqodzqql/editor e use o SQL Editor com as consultas em `supabase/relatorios.sql`. Os relatórios contam apenas acessos com consentimento e não representam pessoas identificadas.

## Publicação
Repositório no GitHub Pages, branch `main`. Para atualizar cache antigo, use Ctrl+F5. Projetos gratuitos Supabase podem pausar após inatividade.

## Limitações
Não há autenticação remota, sincronização entre dispositivos ou sistema de pagamentos. Para vender disciplinas, será necessário autenticação do aluno e proteção do conteúdo no servidor. O material educacional deve passar por revisão pedagógica antes de uma comercialização em larga escala.
