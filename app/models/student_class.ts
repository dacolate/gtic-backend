import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Pricing from './pricing.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Class from './class.js'

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

  @column()
  declare daysTilDeadline: number | null

  @column()
  declare nextdeadline: DateTime | null

  @column()
  declare remainingPayment: number

  @belongsTo(() => Pricing)
  declare pricing: BelongsTo<typeof Pricing>

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
