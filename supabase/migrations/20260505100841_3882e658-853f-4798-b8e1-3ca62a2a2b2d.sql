
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles insertable by owner" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles updatable by owner" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  collection text not null,
  price numeric not null,
  sale_price numeric,
  description text,
  materials text,
  rating numeric default 4.8,
  reviews_count int default 120,
  is_new boolean default false,
  is_just_in boolean default false,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb, -- [{name, swatch, image}]
  images jsonb not null default '[]'::jsonb, -- gallery fallback
  sort_order int default 0,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "Products are publicly readable" on public.products for select using (true);
create index on public.products (collection);
create index on public.products (sort_order);

-- Wishlist
create table public.wishlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);
alter table public.wishlist enable row level security;
create policy "Wishlist viewable by owner" on public.wishlist for select using (auth.uid() = user_id);
create policy "Wishlist insertable by owner" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "Wishlist deletable by owner" on public.wishlist for delete using (auth.uid() = user_id);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text unique not null,
  email text not null,
  shipping jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  shipping_cost numeric not null default 0,
  tax numeric not null default 0,
  total numeric not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Orders viewable by owner" on public.orders for select using (auth.uid() = user_id);
create policy "Orders insertable by anyone (guest checkout allowed)" on public.orders for insert with check (user_id is null or auth.uid() = user_id);
