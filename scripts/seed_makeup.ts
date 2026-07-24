import { fakerES as faker } from '@faker-js/faker';
import { sqlClient } from '../src/lib/sqlClient';

const makeupImages = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  'https://images.unsplash.com/photo-1515688594390-b673ab7d726c?w=800&q=80',
  'https://images.unsplash.com/photo-1487412730607-4e63d30139b1?w=800&q=80',
  'https://images.unsplash.com/photo-1631214369464-a054944d257a?w=800&q=80',
];

async function seedMakeupPosts() {
  console.log('Generando posts de maquillaje en español...');
  
  const { data: profiles } = await sqlClient.from('profiles').select('id').limit(1);
  
  if (!profiles || profiles.length === 0) {
    console.error('No se encontraron perfiles.');
    return;
  }

  const userId = profiles[0].id;
  const posts = makeupImages.map(url => ({
    user_id: userId,
    caption: `¡Me encanta este look de maquillaje! ${faker.commerce.productName()} ✨`,
    image_url: url,
    created_at: new Date().toISOString(),
  }));

  const { error } = await sqlClient.from('posts').insert(posts);
  
  if (error) {
    console.error('Error al insertar posts:', error);
  } else {
    console.log('✅ Se han insertado 5 posts de maquillaje en español exitosamente.');
  }
}

seedMakeupPosts();
