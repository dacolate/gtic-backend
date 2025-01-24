import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Pricing extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string | null

  @column()
  declare registerFee: number

  @column()
  declare instalment1Fee: number

  @column()
  declare instalment2Fee: number

  @column.dateTime()
  declare instalment1Deadline: DateTime

  @column.dateTime()
  declare instalment2Deadline: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
