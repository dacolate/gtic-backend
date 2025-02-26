import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Parent from './parent.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Class from './class.js'
import Attendance from './attendance.js'
import Payment from './payment.js'
import StudentClass from './student_class.js'
// import StudentParent from './student_parent.js'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare firstname: string

  @column()
  declare gender: 'M' | 'F'

  @column()
  declare phone: string

  @column()
  declare email: string | null

  @column()
  declare cni: string | null

  @column()
  declare nationality: string

  @column()
  declare birthday: DateTime

  @column()
  declare address: string | null

  @column()
  declare active: boolean

  @manyToMany(() => Parent, { pivotTable: 'student_parents' })
  declare parents: ManyToMany<typeof Parent>

  @manyToMany(() => Class, { pivotTable: 'student_classes' })
  declare classes: ManyToMany<typeof Class>

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>

  // @hasMany(() => StudentParent)
  // declare parent: HasMany<typeof StudentParent>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => StudentClass)
  declare student_classes: HasMany<typeof StudentClass>

  // @afterFetch()
  // static async updateStudentClassPaymentStatus(students: Student[]) {
  //   for (const student of students) {
  //     // Load the related studentClasses for the current student
  //     const studentClasses = await StudentClass.query()
  //       .where('studentId', student.id)
  //       .preload('pricing') // Preload pricing if needed

  //     // Update paymentStatus for each studentClass
  //     for (const studentClass of studentClasses) {
  //       const payments = await Payment.query()
  //         .where('studentId', studentClass.studentId)
  //         .where('classId', studentClass.classId)
  //         .sum('amount')
  //         .first()

  //       const pricing = studentClass.pricing
  //       if (!pricing) {
  //         studentClass.paymentStatus = 'pricing not found'
  //         continue
  //       }

  //       const totalFee = pricing.registerFee + pricing.instalment1Fee + pricing.instalment2Fee
  //       const totalPaid = payments?.amount || 0

  //       if (totalPaid >= totalFee) {
  //         studentClass.paymentStatus = `up to date (paid: ${totalPaid}, total: ${typeof totalFee})`
  //       } else {
  //         studentClass.paymentStatus = `not up to date (paid: ${totalPaid}, total: ${typeof totalFee})`
  //       }

  //       // Save the updated studentClass
  //       await studentClass.save()
  //     }
  //   }
  // }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
