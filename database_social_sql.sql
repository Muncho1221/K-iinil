-- Habilitar extensión para UUIDs
create extension if not exists "uuid-ossp";

-- 1. Usuarios (Basado en la autenticación de Supabase, pero con perfil extendido)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  bio text
);

-- 2. Posts
create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  caption text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 3. Comentarios
create table comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- 4. Seguidores (Relación M:N)
create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (follower_id, following_id)
);

-- 5. Likes
create table likes (
  user_id uuid references profiles(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  primary key (user_id, post_id)
);
