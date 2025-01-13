import { BaseSchema } from '@adonisjs/lucid/schema'
// import Roles from '../../app/Enums/Roles.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      // table.string('role_id').references('id').inTable('roles').defaultTo(Roles.USER)
      table.string('name').unique().notNullable()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.enum('role', ['admin', 'user']).notNullable().defaultTo('user')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // this.defer(async (db) => {
    //   await db
    //     .table(this.tableName)
    //     .insert({ name: 'admin', email: 'admin@example.com', password: '00000000', role: 'admin' })
    // })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
