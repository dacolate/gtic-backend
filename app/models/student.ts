import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Parent from './parent.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Class from './class.js'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare phone: string

  @column()
  declare email: string

  @column()
  declare address: string

  @column()
  declare active: boolean

  @manyToMany(() => Parent, { pivotTable: 'student_parent' })
  declare parents: ManyToMany<typeof Parent>

  @manyToMany(() => Class, { pivotTable: 'student_class' })
  declare classes: ManyToMany<typeof Class>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
