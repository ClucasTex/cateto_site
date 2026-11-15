-- CATETO: configuração da área de clientes e dos comentários no Supabase
-- Cole tudo no "SQL Editor" do seu projeto Supabase e carregue em "Run".
-- Antes de correr, troque o email do administrador na última secção, se for outro.

-- ---------- administradores ----------
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- ---------- clientes ----------
create table if not exists public.clientes (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  email text not null,
  telefone text,
  notas text,
  criado timestamptz not null default now()
);
alter table public.clientes enable row level security;
drop policy if exists "cliente ve o seu registo" on public.clientes;
create policy "cliente ve o seu registo" on public.clientes for select using (id = auth.uid() or public.is_admin());
drop policy if exists "admin gere clientes" on public.clientes;
create policy "admin gere clientes" on public.clientes for all using (public.is_admin()) with check (public.is_admin());

-- ---------- tours virtuais 360 ----------
create table if not exists public.tours (
  id bigint generated always as identity primary key,
  cliente uuid not null references public.clientes (id) on delete cascade,
  titulo text not null,
  url text not null,
  criado timestamptz not null default now()
);
alter table public.tours enable row level security;
drop policy if exists "cliente ve os seus tours" on public.tours;
create policy "cliente ve os seus tours" on public.tours for select using (cliente = auth.uid() or public.is_admin());
drop policy if exists "admin gere tours" on public.tours;
create policy "admin gere tours" on public.tours for all using (public.is_admin()) with check (public.is_admin());

-- ---------- comentários do site ----------
create table if not exists public.comentarios (
  id bigint generated always as identity primary key,
  nome text not null check (char_length(nome) between 1 and 80),
  texto text not null check (char_length(texto) between 10 and 1500),
  email text check (email is null or char_length(email) <= 120),
  aprovado boolean not null default false,
  criado timestamptz not null default now()
);
alter table public.comentarios enable row level security;
drop policy if exists "qualquer pessoa envia" on public.comentarios;
create policy "qualquer pessoa envia" on public.comentarios for insert with check (aprovado = false);
drop policy if exists "publico ve aprovados" on public.comentarios;
create policy "publico ve aprovados" on public.comentarios for select using (aprovado or public.is_admin());
drop policy if exists "admin modera" on public.comentarios;
create policy "admin modera" on public.comentarios for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin apaga" on public.comentarios;
create policy "admin apaga" on public.comentarios for delete using (public.is_admin());
-- o email de quem comenta nunca é devolvido ao público
revoke select on public.comentarios from anon;
grant select (id, nome, texto, aprovado, criado) on public.comentarios to anon;
grant insert (nome, texto, email) on public.comentarios to anon;

-- ---------- ficheiros (links do Google Drive) ----------
create table if not exists public.ficheiros (
  id bigint generated always as identity primary key,
  cliente uuid not null references public.clientes (id) on delete cascade,
  nome text not null,
  url text not null,
  criado timestamptz not null default now()
);
alter table public.ficheiros enable row level security;
drop policy if exists "cliente ve os seus ficheiros" on public.ficheiros;
create policy "cliente ve os seus ficheiros" on public.ficheiros for select using (cliente = auth.uid() or public.is_admin());
drop policy if exists "admin gere ficheiros" on public.ficheiros;
create policy "admin gere ficheiros" on public.ficheiros for all using (public.is_admin()) with check (public.is_admin());

-- ---------- registo de descargas e visualizações ----------
create table if not exists public.descargas (
  id bigint generated always as identity primary key,
  cliente uuid not null references public.clientes (id) on delete cascade,
  ficheiro bigint references public.ficheiros (id) on delete set null,
  tour bigint references public.tours (id) on delete set null,
  item text not null,
  acao text not null check (acao in ('descarregou','abriu','viu tour')),
  quando timestamptz not null default now()
);
alter table public.descargas enable row level security;
drop policy if exists "cliente regista as suas" on public.descargas;
create policy "cliente regista as suas" on public.descargas for insert to authenticated
  with check (cliente = auth.uid());
drop policy if exists "admin ve registo" on public.descargas;
create policy "admin ve registo" on public.descargas for select using (public.is_admin());
drop policy if exists "admin apaga registo" on public.descargas;
create policy "admin apaga registo" on public.descargas for delete using (public.is_admin());

-- ---------- administrador ----------
-- Este email tem de ser também uma conta criada em Authentication > Users.
insert into public.admins (email) values ('ct@cateto.pt') on conflict do nothing;
