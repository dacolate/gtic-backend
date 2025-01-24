import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Grade from './grade.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Course from './course.js'
import Teacher from './teacher.js'
import Student from './student.js'

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare expectedDuration: number

  @column()
  declare gradeId: number | null

  @column()
  declare courseId: number | null

  @column()
  declare teacherId: number

  @beforeSave()
  static async validateClass(model: Class) {
    // Validate class
    if (model.gradeId && model.courseId) {
      model.courseId = null
    }
    if (!model.startDate) {
      model.startDate = DateTime.now()
    }
  }

  @belongsTo(() => Grade)
  declare grade: BelongsTo<typeof Grade> | null

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course> | null

  @belongsTo(() => Teacher)
  declare teacher: BelongsTo<typeof Teacher>

  @manyToMany(() => Student, { pivotTable: 'student_class' })
  declare students: ManyToMany<typeof Student>

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
