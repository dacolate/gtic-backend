import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_classes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE')
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
      table.date('start_date').nullable()
      // table.string('attendance').nullable() // Could use ENUM if attendance values are predefined
      // table.decimal('special_register_fee', 10, 2).nullable()
      // table.decimal('special_instalment_1_value', 10, 2).nullable()
      // table.decimal('special_instalment_2_value', 10, 2).nullable()
      table
        .integer('pricing_id')
        .unsigned()
        .references('id')
        .inTable('pricings')
        .onDelete('SET NULL')
        .nullable()
      table.string('payment_status').nullable() // Could use ENUM like 'Paid', 'Pending', etc.

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
