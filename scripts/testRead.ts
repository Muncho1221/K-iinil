import 'dotenv/config';
import { sqlService } from '../src/services/sqlService.ts';

async function testRead() {
  console.log('--- LECTURA DE PRUEBA SQL ---');
  try {
    const response = await sqlService.getAll('posts');
    console.log('Response:', response);
  } catch (err) {
    console.error('Error:', err);
  }
}

testRead();
