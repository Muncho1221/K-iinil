-- 1. Crear la función que insertará el perfil automáticamente
-- Corregida para manejar valores nulos en el metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, bio)
  values (
    new.id, 
    -- Si no hay username en el metadata, crea uno basado en el ID
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(md5(new.id::text), 1, 8)),
    '¡Hola! Soy nuevo en K''iinil.'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Crear el trigger que llama a la función al registrarse un usuario
-- (Si ya existe, el 'or replace' no aplica a triggers, así que es bueno verificar)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
