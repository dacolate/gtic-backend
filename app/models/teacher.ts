import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Class from './class.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Teacher extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare phone: string

  @column()
  declare email: string | null

  @column()
  declare active: boolean

  @hasMany(() => Class)
  declare classes: HasMany<typeof Class>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
