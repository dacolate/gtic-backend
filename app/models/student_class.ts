import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Pricing from './pricing.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class StudentClass extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare studentId: number

  @column()
  declare classId: number

  @column()
  declare pricingId: number

  @column()
  declare startDate: DateTime

  @column()
  declare paymentStatus: string

  @belongsTo(() => Pricing)
  declare pricing: BelongsTo<typeof Pricing>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
