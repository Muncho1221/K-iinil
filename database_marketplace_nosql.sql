-- Habilitar extensión para UUIDs
create extension if not exists "uuid-ossp";

-- 1. Tabla de Productos
create table products (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null, -- Vínculo lógico con el usuario en el otro proyecto
  attributes jsonb not null -- {name, price, stock, category, images: [], etc.}
);
