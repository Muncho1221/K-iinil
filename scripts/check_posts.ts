import { sqlClient } from '../src/lib/sqlClient';

async function checkPosts() {
  const { data, error } = await sqlClient.from('posts').select('*');
  if (error) {
    console.error('Error fetching posts:', error);
  } else {
    console.log('Posts in DB:', JSON.stringify(data, null, 2));
  }
}

checkPosts();
