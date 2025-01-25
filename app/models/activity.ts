import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

// table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
// table.string('action').notNullable() // e.g., "create", "update", "delete"
// table.string('table_name').notNullable() // Name of the affected table
// table.integer('record_id').unsigned().nullable() // ID of the affected record
// table.text('description').nullable() // Details about the operation
export default class Activity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare action: string

  @column()
  declare tableName: string

  @column()
  declare recordId: number | null

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
