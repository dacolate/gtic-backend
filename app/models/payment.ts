import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Student from './student.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Class from './class.js'
import StudentClass from './student_class.js'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare studentId: number

  @column()
  declare classId: number

  @column()
  declare studentClassId: number

  @column()
  declare amount: number

  @column()
  declare paymentMethod: 'OM' | 'MOMO' | 'Cash' | 'Bank' | 'Other'

  @column()
  declare details: string | null

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  @belongsTo(() => StudentClass)
  declare student_class: BelongsTo<typeof StudentClass>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
