import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Pricing from './pricing.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Course from './course.js'
import Class from './class.js'

export default class Grade extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare pricingId: number

  @column()
  declare courseId: number

  @column()
  declare teacherId: number

  @belongsTo(() => Pricing)
  declare pricing: BelongsTo<typeof Pricing>

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @hasMany(() => Class)
  declare class: HasMany<typeof Class>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
