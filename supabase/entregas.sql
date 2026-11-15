-- CATETO: caixa de entrega (ficheiros carregados no site, com descarga sempre registada)
-- Corre depois do setup.sql. Pode ser corrido mais de uma vez.

-- ---------- ficheiros entregues ----------
create table if not exists public.entregas (
  id bigint generated always as identity primary key,
  cliente uuid not null references public.clientes (id) on delete cascade,
  caminho text not null unique,            -- <id do cliente>/<data>_<nome do ficheiro>
  nome text not null,
  tamanho bigint,
  criado timestamptz not null default now(),
  expira timestamptz not null default (now() + interval '60 days')
);
alter table public.entregas enable row level security;
drop policy if exists "cliente ve as suas entregas" on public.entregas;
create policy "cliente ve as suas entregas" on public.entregas for select
  using ((cliente = auth.uid() and expira > now()) or public.is_admin());
drop policy if exists "admin gere entregas" on public.entregas;
create policy "admin gere entregas" on public.entregas for all
  using (public.is_admin()) with check (public.is_admin());

-- o registo de descargas passa a guardar também a entrega e o caminho
alter table public.descargas add column if not exists entrega bigint references public.entregas (id) on delete set null;
alter table public.descargas add column if not exists caminho text;

-- ---------- regra que obriga a registar antes de descarregar ----------
-- O link de descarga só é criado se, nos últimos 2 minutos, o próprio cliente
-- tiver registado a descarga desse ficheiro e o ficheiro ainda estiver no prazo.
create or replace function public.pode_descarregar(p_caminho text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
      select 1 from public.entregas e
      where e.caminho = p_caminho and e.cliente = auth.uid() and e.expira > now())
    and exists (
      select 1 from public.descargas d
      where d.caminho = p_caminho and d.cliente = auth.uid() and d.quando > now() - interval '2 minutes');
$$;

-- ---------- armazenamento ----------
insert into storage.buckets (id, name, public, file_size_limit)
values ('entregas', 'entregas', false, 52428800)
on conflict (id) do update set public = false, file_size_limit = 52428800;

drop policy if exists "entregas: cliente descarrega com registo" on storage.objects;
create policy "entregas: cliente descarrega com registo" on storage.objects for select
  using (bucket_id = 'entregas' and (public.is_admin() or public.pode_descarregar(name)));
drop policy if exists "entregas: admin carrega" on storage.objects;
create policy "entregas: admin carrega" on storage.objects for insert
  with check (bucket_id = 'entregas' and public.is_admin());
drop policy if exists "entregas: admin altera" on storage.objects;
create policy "entregas: admin altera" on storage.objects for update
  using (bucket_id = 'entregas' and public.is_admin());
drop policy if exists "entregas: admin apaga" on storage.objects;
create policy "entregas: admin apaga" on storage.objects for delete
  using (bucket_id = 'entregas' and public.is_admin());

-- ---------- aviso por email ----------
-- O endereço do Google Apps Script e o segredo ficam só aqui, nunca no site.
create extension if not exists pg_net with schema extensions;

create table if not exists public.aviso_config (
  id int primary key default 1 check (id = 1),
  url text,
  segredo text
);
alter table public.aviso_config enable row level security;  -- sem regras: só o servidor lê

create or replace function public.avisar_descarga() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare
  cfg record;
  c record;
begin
  if new.acao not in ('descarregou', 'abriu') then return new; end if;
  select * into cfg from public.aviso_config where id = 1;
  if cfg.url is null or cfg.url = '' then return new; end if;
  select nome, email into c from public.clientes where id = new.cliente;
  perform net.http_post(
    url := cfg.url,
    body := jsonb_build_object(
      'segredo', cfg.segredo,
      'cliente', coalesce(c.nome, ''),
      'email', coalesce(c.email, ''),
      'acao', new.acao,
      'item', new.item,
      'quando', to_char(new.quando at time zone 'Europe/Lisbon', 'DD/MM/YYYY "às" HH24:MI')),
    headers := '{"Content-Type": "application/json"}'::jsonb);
  return new;
exception when others then
  return new;  -- um erro no aviso nunca impede o registo
end $$;

drop trigger if exists avisar_descarga on public.descargas;
create trigger avisar_descarga after insert on public.descargas
  for each row execute function public.avisar_descarga();
