import { sqlClient } from '../lib/sqlClient.ts'

export const sqlService = {
  // Ejemplo de operaciones CRUD generales para SQL
  async getAll(table: string) {
    // Si la tabla contiene parámetros de consulta (query params), los manejamos simple
    if (table.includes('?')) {
        const [tableName, query] = table.split('?');
        const [param, value] = query.split('=');
        // Aseguramos que no se duplique el 'eq'
        const cleanValue = value.replace('eq.', '');
        return await sqlClient.from(tableName).select('*').eq(param, cleanValue);
    }
    return await sqlClient.from(table).select('*').order('created_at', { ascending: false });
  },
  async getPostsWithProfiles() {
    return await sqlClient
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey(
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });
  },
  async insert(table: string, data: any) {
    return await sqlClient.from(table).insert(data)
  },
  async delete(table: string, id: number | string) {
    return await sqlClient.from(table).delete().eq('id', id);
  }
}
