import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { generateProfiles, generatePosts, generateComments, generateLikes, generateFollows, generateProducts } from './generateData.js';

const sqlClient = createClient(
  'https://rjfwvuddlcudjjmcuhco.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY!
);
const noSqlClient = createClient(
  process.env.VITE_SECOND_SUPABASE_URL!,
  process.env.VITE_SECOND_SUPABASE_ANON_KEY!
);

async function seed() {
  console.log('--- Iniciando poblamiento masivo ---');

  // --- SQL (Supabase 1) ---
  console.log('Generando perfiles...');
  const profiles = generateProfiles(50);
  await sqlClient.from('profiles').insert(profiles);
  const profileIds = profiles.map(p => p.id);
  console.log('Perfiles insertados.');

  console.log('Generando posts...');
  const posts = generatePosts(50, profileIds);
  const { error: postErr } = await sqlClient.from('posts').insert(posts);
  if (postErr) {
    console.error('Error insertando posts:', postErr);
    return;
  }
  
  const { data: insertedPosts, error: selectErr } = await sqlClient.from('posts').select('id');
  if (selectErr) {
      console.error('Error seleccionando posts:', selectErr);
      return;
  }
  const postIds = insertedPosts!.map(p => p.id);
  console.log('Posts insertados.');

  console.log('Generando comentarios...');
  const comments = generateComments(50, profileIds, postIds);
  await sqlClient.from('comments').insert(comments);
  console.log('Comentarios insertados.');

  console.log('Generando likes...');
  const likes = generateLikes(50, profileIds, postIds);
  await sqlClient.from('likes').insert(likes);
  console.log('Likes insertados.');

  console.log('Generando follows...');
  const follows = generateFollows(50, profileIds);
  await sqlClient.from('follows').insert(follows);
  console.log('Follows insertados.');

  // --- NoSQL (Supabase 2) ---
  console.log('Generando 10,000 productos (NoSQL)...');
  const batchSize = 500;
  for (let i = 0; i < 10000; i += batchSize) {
    const products = generateProducts(batchSize);
    await noSqlClient.from('products').insert(products);
    console.log(`Insertados ${i + batchSize} / 10000 productos`);
  }
  console.log('Productos NoSQL finalizados.');

  console.log('--- Poblamiento masivo finalizado ---');
}

seed().catch(console.error);
