-- Minha Graduação — estatísticas de uso anônimas e opcionais.
-- Executar APENAS no projeto Supabase dedicado a este simulador.
-- NUNCA disponibilizar leitura pública dos eventos.
create table if not exists public.mg_usage_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  session_id uuid not null,
  event_type text not null check (event_type in ('visit','view','course_open','topic_change')),
  section varchar(36),
  course_id varchar(36)
);
create index if not exists mg_usage_occurred_idx on public.mg_usage_events(occurred_at desc);
create index if not exists mg_usage_type_idx on public.mg_usage_events(event_type,occurred_at desc);
alter table public.mg_usage_events enable row level security;
revoke all on public.mg_usage_events from anon, authenticated;
grant insert on public.mg_usage_events to anon;
drop policy if exists "mg_anon_insert_usage" on public.mg_usage_events;
create policy "mg_anon_insert_usage" on public.mg_usage_events
for insert to anon
with check (event_type in ('visit','view','course_open','topic_change')
  and length(coalesce(section,''))<=36 and length(coalesce(course_id,''))<=36);
-- RELATÓRIOS: executar pelo painel SQL do proprietário (não no navegador público).
-- Visitantes únicos por dia (por sessão, não por pessoa):
-- select occurred_at::date dia,count(distinct session_id) sessoes
-- from public.mg_usage_events where event_type='visit'
-- group by 1 order by 1 desc limit 30;
-- Disciplinas mais abertas:
-- select course_id,count(*) aberturas from public.mg_usage_events
-- where event_type='course_open' group by 1 order by 2 desc;
-- Verificações:
-- select relrowsecurity from pg_class where oid='public.mg_usage_events'::regclass;
