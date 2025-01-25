import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'teachers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // table.boolean('active').defaultTo(true).notNullable()
      // table.index('name') // Add index to 'name' column
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // table.dropColumn('active') // Remove 'active' column
    })
  }
}
