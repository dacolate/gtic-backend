import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Grade from './grade.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Course from './course.js'
import Teacher from './teacher.js'
import Student from './student.js'
import Pricing from './pricing.js'

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
  declare gradeId?: number | null

  @column()
  declare courseId: number | null

  @column()
  declare pricingId: number

  @column()
  declare teacherId: number

  @column()
  declare active: boolean

  @beforeSave()
  static async validateClass(model: Class) {
    if (!model.startDate) {
      model.startDate = DateTime.now()
    }

    if (model.gradeId) {
      const grade = await Grade.find(model.gradeId)

      if (!grade) {
        throw new Error('The specified grade does not exits.')
      }

      if (model.courseId && grade.courseId !== model.courseId) {
        throw new Error('The provided grade does not belong to the specified course.')
      }
    }

    if (!model.gradeId && model.courseId) {
      const course = await Course.find(model.courseId)

      if (course?.grades) {
        throw new Error('Can not assign directly to a grade with courses')
      }
    }
  }

  @beforeSave()
  static async validatePricing(model: Class) {
    if (!model.pricingId) {
      const grade = await Grade.find(model.gradeId)
      if (grade) {
        model.pricingId = grade?.pricingId ?? null
      } else {
        const course = await Course.find(model.courseId)
        model.pricingId = course?.pricingId ?? 0
      }
    }
  }

  @belongsTo(() => Grade)
  declare grade: BelongsTo<typeof Grade>

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @belongsTo(() => Teacher)
  declare teacher: BelongsTo<typeof Teacher>

  @belongsTo(() => Pricing)
  declare pricing: BelongsTo<typeof Pricing>

  @manyToMany(() => Student, { pivotTable: 'student_class' })
  declare students: ManyToMany<typeof Student>

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
