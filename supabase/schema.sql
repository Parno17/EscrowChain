create table if not exists public.products (
  id text primary key,
  seller_address text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint products_payload_id_matches check (payload ->> 'id' = id),
  constraint products_payload_seller_matches check (payload ->> 'sellerAddress' = seller_address)
);

create table if not exists public.orders (
  id bigint primary key,
  buyer_address text not null,
  seller_address text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint orders_payload_id_matches check (payload ->> 'id' = id::text),
  constraint orders_payload_buyer_matches check (payload ->> 'buyer' = buyer_address),
  constraint orders_payload_seller_matches check (payload ->> 'seller' = seller_address)
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Authenticated users can view products" on public.products;
create policy "Authenticated users can view products"
  on public.products for select to authenticated using (true);

drop policy if exists "Sellers can create their products" on public.products;
create policy "Sellers can create their products"
  on public.products for insert to authenticated
  with check (
    seller_address = (select auth.uid()::text)
    and payload ->> 'sellerAddress' = seller_address
  );

drop policy if exists "Sellers can update their products" on public.products;
create policy "Sellers can update their products"
  on public.products for update to authenticated
  using (seller_address = (select auth.uid()::text))
  with check (
    seller_address = (select auth.uid()::text)
    and payload ->> 'sellerAddress' = seller_address
  );

drop policy if exists "Sellers can delete their products" on public.products;
create policy "Sellers can delete their products"
  on public.products for delete to authenticated
  using (seller_address = (select auth.uid()::text));

drop policy if exists "Authenticated users can view orders" on public.orders;
create policy "Authenticated users can view orders"
  on public.orders for select to authenticated
  using (
    buyer_address = (select auth.uid()::text)
    or seller_address = (select auth.uid()::text)
  );

drop policy if exists "Buyers can create their orders" on public.orders;
create policy "Order initiators can create their orders"
  on public.orders for insert to authenticated
  with check (
    (
      (
        buyer_address = (select auth.uid()::text)
        and payload ->> 'initiator' = 'buyer'
      )
      or (
        seller_address = (select auth.uid()::text)
        and payload ->> 'initiator' = 'seller'
      )
    )
    and payload ->> 'buyer' = buyer_address
    and payload ->> 'seller' = seller_address
  );

drop policy if exists "Order parties can update orders" on public.orders;
create policy "Order parties can update orders"
  on public.orders for update to authenticated
  using (
    buyer_address = (select auth.uid()::text)
    or seller_address = (select auth.uid()::text)
  )
  with check (
    (
      buyer_address = (select auth.uid()::text)
      or seller_address = (select auth.uid()::text)
    )
    and payload ->> 'buyer' = buyer_address
    and payload ->> 'seller' = seller_address
  );

create or replace function public.prevent_order_party_change()
returns trigger
language plpgsql
as $$
begin
  if new.buyer_address <> old.buyer_address or new.seller_address <> old.seller_address then
    raise exception 'Order buyer and seller identities cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_order_party_change on public.orders;
create trigger prevent_order_party_change
  before update on public.orders
  for each row execute function public.prevent_order_party_change();

create or replace function public.reserve_product_stock_for_order()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  item_id text := nullif(new.payload ->> 'productId', '');
  item_quantity integer := coalesce((new.payload ->> 'quantity')::integer, 0);
begin
  if new.payload ->> 'initiator' <> 'buyer' then
    return new;
  end if;

  if item_id is null or not exists (select 1 from public.products where id = item_id) then
    return new;
  end if;

  if item_quantity < 1 then
    raise exception 'Order quantity must be positive';
  end if;

  update public.products
  set payload = jsonb_set(
    jsonb_set(
      payload,
      '{stock}',
      to_jsonb((payload ->> 'stock')::integer - item_quantity),
      true
    ),
    '{isAvailable}',
    to_jsonb((payload ->> 'stock')::integer - item_quantity > 0),
    true
  ),
  updated_at = now()
  where id = item_id
    and seller_address = new.seller_address
    and coalesce((payload ->> 'stock')::integer, 0) >= item_quantity
    and coalesce((payload ->> 'isAvailable')::boolean, false);

  if not found then
    raise exception 'Product is unavailable or stock is insufficient';
  end if;

  return new;
end;
$$;

drop trigger if exists reserve_product_stock_for_order on public.orders;
create trigger reserve_product_stock_for_order
  after insert on public.orders
  for each row execute function public.reserve_product_stock_for_order();

alter table public.products replica identity full;
alter table public.orders replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.products;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
