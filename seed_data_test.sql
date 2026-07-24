-- Script para poblar bases de datos con datos coherentes (Subset de prueba)
-- NOTA: Insertar 20,000 registros mediante SQL directo en el editor causará problemas de rendimiento.
-- He generado este archivo con un set inicial. Para los 10,000 registros, usa el script de Node.js.

-- 1. Poblando tabla public.posts (JSONB content)
INSERT INTO public.posts (content) VALUES 
('{"user": "ana_makeup", "caption": "Probando el nuevo labial mate, ¡me encanta!", "tags": ["makeup", "kiiinil"], "likes": 120}'),
('{"user": "mateo_style", "caption": "Tutorial de delineado perfecto en 1 minuto.", "tags": ["tutorial", "eyes"], "likes": 85}'),
('{"user": "sofia_beauty", "caption": "Mi rutina de cuidado facial nocturna.", "tags": ["skincare", "night"], "likes": 210}'),
('{"user": "carlos_vlogs", "caption": "Un look natural para ir a trabajar.", "tags": ["natural", "work"], "likes": 45}'),
('{"user": "makeup_lover", "caption": "¡La pigmentación de esta paleta es increíble!", "tags": ["eyeshadow", "review"], "likes": 305}');

-- 2. Poblando tabla public.products (JSONB attributes)
INSERT INTO public.products (attributes) VALUES 
('{"name": "Labial Mate Intenso", "price": "299.00", "category": "Labios", "description": "Larga duración, no reseca.", "rating": 4.8}'),
('{"name": "Paleta Sombras Kiiinil", "price": "450.00", "category": "Ojos", "description": "12 tonos mate y brillantes.", "rating": 4.9}'),
('{"name": "Delineador Precisión", "price": "180.00", "category": "Ojos", "description": "Punta fina resistente al agua.", "rating": 4.5}'),
('{"name": "Rubor Natural", "price": "220.00", "category": "Rostro", "description": "Textura sedosa para mejillas.", "rating": 4.7}'),
('{"name": "Base de Maquillaje HD", "price": "380.00", "category": "Rostro", "description": "Cobertura total acabado natural.", "rating": 4.6}');
