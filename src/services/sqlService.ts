import { sqlClient } from '../lib/sqlClient.ts'

export const sqlService = {
  // Ejemplo de operaciones CRUD generales para SQL
  async getAll(table: string) {
    return await sqlClient.from(table).select('*')
  },
  async insert(table: string, data: any) {
    return await sqlClient.from(table).insert(data)
  }
}
