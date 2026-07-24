import { faker } from '@faker-js/faker';

// Diccionario temático de maquillaje
const MAQUILLAJE_TEMAS = [
  'Look de noche', 'Maquillaje natural', 'Tutorial de delineado', 
  'Reseña de labiales', 'Skincare diario', 'Paleta de colores',
  'Contouring perfecto', 'Tips de belleza', 'Glamour total'
];

export const generateProfiles = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    username: faker.internet.username(),
    avatar_url: faker.image.avatar(),
    bio: `Amante del maquillaje y ${faker.helpers.arrayElement(['skincare', 'glitter', 'tendencias', 'belleza natural'])}.`,
  }));
};

export const generatePosts = (count: number, userIds: string[]) => {
  return Array.from({ length: count }, () => ({
    user_id: faker.helpers.arrayElement(userIds),
    caption: `${faker.helpers.arrayElement(MAQUILLAJE_TEMAS)} ✨ ${faker.lorem.sentence()}`,
    image_url: faker.image.url(), // Idealmente usar una URL que traiga imágenes de maquillaje
  }));
};

export const generateComments = (count: number, userIds: string[], postIds: string[]) => {
  const comentarios = ['¡Me encanta este look!', '¿Qué marca es el labial?', 'Necesito ese tono', 'Increíble técnica 😍'];
  return Array.from({ length: count }, () => ({
    user_id: faker.helpers.arrayElement(userIds),
    post_id: faker.helpers.arrayElement(postIds),
    content: faker.helpers.arrayElement(comentarios),
  }));
};

export const generateLikes = (count: number, userIds: string[], postIds: string[]) => {
  const likes = new Set();
  const result = [];
  while (result.length < count && likes.size < userIds.length * postIds.length) {
    const user_id = faker.helpers.arrayElement(userIds);
    const post_id = faker.helpers.arrayElement(postIds);
    const key = `${user_id}:${post_id}`;
    if (!likes.has(key)) {
      likes.add(key);
      result.push({ user_id, post_id });
    }
  }
  return result;
};

export const generateFollows = (count: number, userIds: string[]) => {
  const follows = new Set();
  const result = [];
  while (result.length < count && follows.size < userIds.length * (userIds.length - 1)) {
    const follower_id = faker.helpers.arrayElement(userIds);
    const following_id = faker.helpers.arrayElement(userIds);
    if (follower_id !== following_id) {
      const key = `${follower_id}:${following_id}`;
      if (!follows.has(key)) {
        follows.add(key);
        result.push({ follower_id, following_id });
      }
    }
  }
  return result;
};

export const generateProducts = (count: number) => {
  const categorias = ['Labios', 'Ojos', 'Rostro', 'Skincare'];
  return Array.from({ length: count }, () => ({
    attributes: {
      name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
      price: faker.commerce.price({ min: 50, max: 2000 }),
      category: faker.helpers.arrayElement(categorias),
      description: faker.commerce.productDescription(),
    },
  }));
};
