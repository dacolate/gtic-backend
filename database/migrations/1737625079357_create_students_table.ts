import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('firstname').notNullable()
      table.enum('gender', ['M', 'F']).notNullable()
      table.string('nationality').notNullable()
      table.date('birthday').notNullable()
      table.string('cni').nullable()
      table.string('phone').notNullable().unique()
      table.string('email').nullable().unique()
      table.string('address').nullable()
      table.boolean('active').defaultTo(true).notNullable()
      table.index('name')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
