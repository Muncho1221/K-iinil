-- 1. Crear la función que insertará el perfil automáticamente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, bio)
  values (new.id, new.raw_user_meta_data->>'username', '¡Hola! Soy nuevo en K''iinil.');
  return new;
end;
$$ language plpgsql security definer;

-- 2. Crear el trigger que llama a la función al registrarse un usuario
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
