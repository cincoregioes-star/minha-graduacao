-- Minha Graduação: métricas de uso com consentimento, versão 1.
-- Executar no SQL Editor de um projeto Supabase EXCLUSIVO do produto.
-- Chave publishable no navegador; nunca utilizar service_role nem sb_secret.

create table if not exists public.mg_usage_events (
 id bigint generated always as identity primary key,
 created_at timestamptz not null default now(),
 visitor_id uuid not null,
 session_id uuid not null,
 event_type text not null check (event_type in ('page_view','course_open','lesson_toggle','quiz_complete','assessment_complete')),
 page text not null check (char_length(page) between 1 and 40),
 course_id text check (course_id is null or course_id ~ '^s[1-8]d[1-6]$')
);
create index if not exists mg_usage_events_created_idx on public.mg_usage_events(created_at desc);
create index if not exists mg_usage_events_event_idx on public.mg_usage_events(event_type, created_at desc);

alter table public.mg_usage_events enable row level security;
revoke all on table public.mg_usage_events from anon, authenticated;
grant usage on schema public to anon;
grant insert (visitor_id,session_id,event_type,page,course_id) on public.mg_usage_events to anon;

drop policy if exists "mg_insert_anon_event" on public.mg_usage_events;
create policy "mg_insert_anon_event" on public.mg_usage_events
for insert to anon
with check (
 event_type in ('page_view','course_open','lesson_toggle','quiz_complete','assessment_complete')
 and page in ('home','curriculum','learning','classroom','quiz','academico','lab','progress','profile','about')
 and (course_id is null or course_id ~ '^s[1-8]d[1-6]$')
);

-- Consulta 1: visualizações e usuários aproximados nos últimos 30 dias
select created_at::date dia,
 count(*) filter (where event_type='page_view') visualizacoes,
 count(distinct visitor_id) navegadores_distintos,
 count(distinct session_id) sessoes
from public.mg_usage_events
where created_at >= now() - interval '30 days'
group by 1 order by 1 desc;

-- Consulta 2: interesse em disciplinas e avaliações
select event_type,coalesce(course_id,'-') disciplina,
 count(*) eventos,count(distinct visitor_id) navegadores
from public.mg_usage_events
where created_at >= now() - interval '30 days'
group by 1,2 order by eventos desc;
