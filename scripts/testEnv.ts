import 'dotenv/config';
console.log('--- ENV DIAGNOSTIC ---');
console.log('SQL_URL:', process.env.VITE_SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('SQL_KEY_LEN:', process.env.VITE_SUPABASE_ANON_KEY?.length);
console.log('NoSQL_URL:', process.env.VITE_SECOND_SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('NoSQL_KEY_LEN:', process.env.VITE_SECOND_SUPABASE_ANON_KEY?.length);
