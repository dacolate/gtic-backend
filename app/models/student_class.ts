import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Pricing from './pricing.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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

  // @beforeFind()
  // static async updatePaymentStatus(model: StudentClass) {
  //   try {
  //     const payments = await Payment.query()
  //       .where('studentId', model.studentId)
  //       .where('classId', model.classId)
  //       .sum('amount')
  //       .first()

  //     const pricing = await Pricing.find(model.pricingId)
  //     if (!pricing) {
  //       model.paymentStatus = 'pricing not found'
  //       return
  //     }

  //     const totalFee = pricing.registerFee + pricing.instalment1Fee + pricing.instalment2Fee
  //     const totalPaid = payments?.amount || 0

  //     if (totalPaid >= totalFee) {
  //       model.paymentStatus = `up to date (paid: ${totalPaid}, total: ${totalFee})`
  //     } else {
  //       model.paymentStatus = `not up to date (paid: ${totalPaid}, total: ${totalFee})`
  //     }
  //   } catch (error) {
  //     console.error('Error updating payment status:', error)
  //     model.paymentStatus = 'error'
  //   }
  // }

  @belongsTo(() => Pricing)
  declare pricing: BelongsTo<typeof Pricing>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
