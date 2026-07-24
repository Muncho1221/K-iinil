import { sqlClient } from '../src/lib/sqlClient';

const makeupImages = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  'https://images.unsplash.com/photo-1515688594390-b673ab7d726c?w=800&q=80',
  'https://images.unsplash.com/photo-1487412730607-4e63d30139b1?w=800&q=80',
  'https://images.unsplash.com/photo-1631214369464-a054944d257a?w=800&q=80',
];

async function fixPlaceholderPosts() {
  console.log('Fixing posts with placeholder images...');
  
  const { data: posts, error } = await sqlClient.from('posts').select('*');
  
  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  for (const post of posts) {
    if (post.image_url && post.image_url.includes('placehold.co')) {
      const newUrl = makeupImages[Math.floor(Math.random() * makeupImages.length)];
      await sqlClient.from('posts').update({ image_url: newUrl }).eq('id', post.id);
      console.log(`Updated post ${post.id} with image ${newUrl}`);
    }
  }
  console.log('✅ Fix complete.');
}

fixPlaceholderPosts();
