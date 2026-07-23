import { noSqlClient } from '../lib/noSqlClient.ts'

export const noSqlService = {
  // Ejemplo de operaciones CRUD para NoSQL (Documental)
  async getDocuments(table: string) {
    return await noSqlClient.from(table).select('*')
  },
  async insertDocument(table: string, data: any) {
    return await noSqlClient.from(table).insert({ content: data })
  }
}
