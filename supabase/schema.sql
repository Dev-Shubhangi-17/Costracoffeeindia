-- COSTRA Coffee - Supabase E-Commerce Core Database Schema

-- 1. Create Profiles Table (Linked to Supabase Auth auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  items jsonb not null, -- Stores product arrays: {productId, name, price, quantity, weight, grind}
  total_amount numeric not null,
  payment_status text not null check (payment_status in ('pending', 'paid', 'cod')),
  shipping_address jsonb not null, -- Stores name, phone, pincode, city, address details
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- 4. Enable Profiles RLS Policies
create policy "Users can view own profile record" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile record" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile record" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- 5. Enable Orders RLS Policies
create policy "Users can view own orders list" 
  on public.orders for select 
  using (auth.uid() = user_id);

create policy "Users can insert own order transactions" 
  on public.orders for insert 
  with check (auth.uid() = user_id);

-- 6. Trigger Function to Automatically Create Profile Record on New Auth User Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, created_at)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', ''), 
    new.created_at
  );
  return new;
end;
$$ language plpgsql security definer;

-- Bind trigger execution on auth.users inserts
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
