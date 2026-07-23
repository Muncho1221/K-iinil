import { faker } from '@faker-js/faker';
import { sqlService } from '../src/services/sqlService.ts';
import { noSqlService } from '../src/services/noSqlService.ts';

/**
 * Script para poblar bases de datos de Actividad 2.
 * Ejecutar con: npx ts-node scripts/generateData.ts
 */

async function generateData() {
  console.log('Iniciando generación de datos realistas con Faker...');

  // 1. Generar 50 registros en SQL (Posts)
  console.log('Insertando 50 registros en SQL...');
  const sqlData = Array.from({ length: 50 }).map(() => ({
    user: faker.internet.username(),
    caption: faker.lorem.sentence(),
    created_at: faker.date.past().toISOString(),
  }));
  
  await sqlService.insert('posts', sqlData);
  console.log('SQL poblado con 50 registros.');

  // 2. Generar 10,000 registros en "NoSQL" (Products)
  console.log('Insertando 10,000 registros en NoSQL...');
  const noSqlData = Array.from({ length: 10000 }).map(() => ({
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 10, max: 200 }),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    timestamp: faker.date.recent().toISOString(),
  }));

  // Batch insert en grupos de 500 para evitar errores de payload de Supabase
  for (let i = 0; i < noSqlData.length; i += 500) {
    const batch = noSqlData.slice(i, i + 500);
    // Para NoSQL, insertamos el objeto como un documento
    await noSqlService.insertDocument('products', batch);
  }
  
  console.log('NoSQL poblado con 10,000 registros.');
  console.log('Generación finalizada.');
}

generateData().catch(console.error);
