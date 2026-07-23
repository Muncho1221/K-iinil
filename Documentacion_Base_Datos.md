# Documentación: Estructura de Datos NoSQL (Document-Oriented) - Proyecto Kiiinil

## 1. Introducción para el desarrollador de Backend
Este documento detalla la implementación de una **base de datos NoSQL** utilizando la flexibilidad de **PostgreSQL (vía Supabase)**. En lugar de tablas relacionales rígidas, utilizaremos columnas tipo `JSONB` para almacenar documentos. Esto permite evolucionar la estructura de datos sin alterar el esquema.

---

## 2. Schema SQL (Copia y pega en SQL Editor)
Este esquema define tablas como "contenedores de documentos".

```sql
-- Habilitar extensión para UUIDs
create extension if not exists "uuid-ossp";

-- 1. Tabla de Documentos: Posts
-- Estilo NoSQL: Toda la información del post vive en una columna JSONB 'content'
create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  created_at timestamp with time zone default now(),
  content jsonb not null 
  -- Ejemplo de contenido: { "user": "...", "caption": "...", "tags": [...], "shopTag": {...} }
);

-- 2. Tabla de Documentos: Productos
create table products (
  id uuid primary key default uuid_generate_v4(),
  attributes jsonb not null 
  -- Ejemplo de atributos: { "name": "...", "price": "...", "shade": "...", "rating": 4.9 }
);
```

---

## 3. Guía de Implementación para el Backend
1.  **Ejecutar el Schema:** Ejecuta el código SQL superior en el `SQL Editor` de Supabase.
2.  **Activar RLS:** En `Table Editor`, habilita `Row Level Security` (RLS) en las tablas `posts` y `products`.
3.  **Configurar Políticas:** Crea políticas `SELECT`, `INSERT`, `UPDATE` básicas (ej: `using (true)` para acceso público) para permitir la lectura y escritura desde la aplicación.
4.  **Flexibilidad:** Si el frontend necesita nuevos campos (ej. video, nuevas categorías), no hace falta hacer `ALTER TABLE`. Solo modifica el objeto JSON que se envía al campo `content` o `attributes`.

---

## 4. Ejemplo de Integración (Frontend)
El frontend interactuará con Supabase enviando o recibiendo objetos JSON planos.

```typescript
// Ejemplo: Insertar un post completo (Documento NoSQL)
await supabase.from('posts').insert([{
  content: {
    user: 'Tú',
    caption: '¡Nuevo look de hoy!',
    tags: ['#makeup', '#kiiinil'],
    liked: false
  }
}]);
```

---

*Nota: Esta base de datos actúa como un repositorio de documentos flexible.*
