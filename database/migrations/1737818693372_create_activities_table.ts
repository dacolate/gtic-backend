import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.string('action').notNullable() // e.g., "create", "update", "delete"
      table.string('table_name').notNullable() // Name of the affected table
      table.integer('record_id').unsigned().nullable() // ID of the affected record
      table.text('description').nullable() // Details about the operation
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
