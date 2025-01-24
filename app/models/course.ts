import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Pricing from './pricing.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Grade from './grade.js'
import Class from './class.js'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare pricingId: number

  @belongsTo(() => Pricing)
  declare pricing: BelongsTo<typeof Pricing>

  @hasMany(() => Grade)
  declare grades: HasMany<typeof Grade>

  @hasMany(() => Class)
  declare classes: HasMany<typeof Class>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
