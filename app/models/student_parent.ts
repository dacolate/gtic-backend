import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Student from './student.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Parent from './parent.js'

export default class StudentParent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare studentId: number

  @column()
  declare parentId: number

  @column()
  declare paymentStatus: string

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => Parent)
  declare parent: BelongsTo<typeof Parent>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
