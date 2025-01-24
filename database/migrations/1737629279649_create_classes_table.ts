import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('description').nullable()
      table
        .integer('teacher_id')
        .unsigned()
        .references('id')
        .inTable('teachers')
        .onDelete('SET NULL')
      table.integer('grade_id').unsigned().references('id').inTable('grades').onDelete('SET NULL')
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('SET NULL')
      table.date('start_date').notNullable()
      table.integer('expected_duration').notNullable() // Duration in days

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
