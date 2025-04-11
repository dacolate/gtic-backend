import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.string('message', 255).notNullable()
      table.boolean('is_read').defaultTo(false)
      table.boolean('admin').defaultTo(false)
      table.boolean('sent').defaultTo(false)
      table.enum('type', ['student', 'class', 'payment']).notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
