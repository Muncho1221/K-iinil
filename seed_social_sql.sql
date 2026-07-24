-- Script SQL para poblar la Red Social (SQL)
-- Se eliminó la restricción temporalmente para permitir inserciones sin usuario ligado
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;

-- Inserción de Posts de prueba
INSERT INTO posts (caption, image_url)
VALUES 
('¡Bienvenidos a la nueva era de Kiiinil!', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'),
('Descubre nuestros nuevos labiales mate.', 'https://images.unsplash.com/photo-1586445781097-951662820063?w=800'),
('Tutorial de maquillaje para eventos especiales.', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'),
('¡Amamos el estilo de esta semana!', 'https://images.unsplash.com/photo-1571874457388-349f4b3970b8?w=800'),
('El delineado perfecto sí existe.', 'https://images.unsplash.com/photo-1597354964173-9a4f41b212f4?w=800');
