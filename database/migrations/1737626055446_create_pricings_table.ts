import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pricings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('description').nullable()
      table.decimal('register_fee', 10, 2).notNullable()
      table.date('instalment_1_deadline').notNullable()
      table.decimal('instalment_1_fee', 10, 2).notNullable()
      table.date('instalment_2_deadline').notNullable()
      table.decimal('instalment_2_fee', 10, 2).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
