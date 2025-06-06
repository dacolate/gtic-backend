// import type { HttpContext } from '@adonisjs/core/http'

import Student from '#models/student'
import { newStudentValidator } from '#validators/new_student'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Parent from '#models/parent'
import Payment from '#models/payment'
import StudentClass from '#models/student_class'
import Class from '#models/class'
import StudentParent from '#models/student_parent'
import Pricing from '#models/pricing'
import { ActivityLogger } from '#services/activity_logger'

export default class NewStudentsController {
  modInstance = Student
  async store({ auth, request, response }: HttpContext) {
    let payload
    console.log('store', 'Just entered')

    // Validate the request data and catch validation errors
    try {
      payload = await request.validateUsing(newStudentValidator)
      console.log(payload)
    } catch (error) {
      // Catch validation errors
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
    }
    console.log('valOne', 'First validation passed')
    try {
      const studentName = await Student.query()
        .where('name', payload.name)
        .andWhere('firstname', payload.firstname)
        .first()
      console.log('studentName', studentName)
      if (studentName) {
        return response
          .status(422)
          .json(RequestResponse.failure(studentName, 'Existing student name'))
      }
      const studentEmail = payload.email
        ? await Student.query()
            .where('email', payload.email as string)
            .first()
        : null
      console.log('studentEmail', studentEmail)
      if (studentEmail) {
        return response
          .status(422)
          .json(RequestResponse.failure(studentEmail, 'Existing student email'))
      }

      const studentPhone = payload.phone
        ? await Student.query().where('phone', payload.phone).first()
        : null
      console.log('studentPhone', studentPhone)
      if (studentPhone) {
        return response
          .status(422)
          .json(RequestResponse.failure(studentPhone, 'Existing student phone'))
      }
    } catch (error) {
      return response
        .status(400)
        .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
    }

    // Start a database transaction
    const trx = await db.transaction()

    try {
      // Create the student
      const student = await Student.create(
        {
          name: payload.name,
          firstname: payload.firstname,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          gender: payload.gender,
          cni: payload.cni,
          nationality: payload.nationality,
          birthday: payload.birthday,
        },
        { client: trx }
      )

      // Create the parent if given
      let parent = null
      if (payload.parentName || payload.parentPhone || payload.parentEmail) {
        parent = await Parent.create(
          {
            name: payload.parentName,
            phone: payload.parentPhone,
            email: payload.parentEmail,
          },
          { client: trx }
        )
        await StudentParent.create(
          {
            studentId: student.id,
            parentId: parent.id,
          },
          { client: trx }
        )
      }
      // Create the pricing

      const pricing = await Pricing.firstOrCreate(
        {
          registerFee: payload.registrationFee,
          instalment1Fee: payload.firstInstalmentFee,
          instalment2Fee: payload.secondInstalmentFee,
          instalment1Deadline: payload.firstInstalmentDeadline,
          instalment2Deadline: payload.secondInstalmentDeadline,
        },
        {
          registerFee: payload.registrationFee,
          instalment1Fee: payload.firstInstalmentFee,
          instalment2Fee: payload.secondInstalmentFee,
          instalment1Deadline: payload.firstInstalmentDeadline,
          instalment2Deadline: payload.secondInstalmentDeadline,
        },
        { client: trx }
      )

      const chosenClass = await Class.query()
        .where('id', payload.class)
        .preload('course')
        .preload('grade')
        .preload('teacher')
        .first()

      const remainingPayment = Math.max(
        0,
        payload.registrationFee +
          payload.firstInstalmentFee +
          payload.secondInstalmentFee -
          payload.paymentAmount
      )

      console.log('r', remainingPayment)

      const nextDeadline =
        payload.paymentAmount < payload.registrationFee + payload.firstInstalmentFee
          ? payload.firstInstalmentDeadline
          : payload.paymentAmount <
              payload.registrationFee + payload.firstInstalmentFee + payload.secondInstalmentFee
            ? payload.secondInstalmentDeadline
            : null
      console.log('nd', nextDeadline)

      const studclass = await StudentClass.create(
        {
          studentId: student.id,
          classId: chosenClass?.id,
          pricingId: pricing.id,
          remainingPayment: remainingPayment,
          nextdeadline: nextDeadline,
        },
        { client: trx }
      )

      // Create the payment
      const payment = await Payment.create(
        {
          studentId: student.id, // Link the payment to the student
          classId: chosenClass?.id,
          amount: payload.paymentAmount,
          paymentMethod: payload.paymentMethod,
          studentClassId: studclass.id,
        },
        { client: trx }
      )

      // Commit the transaction
      await trx.commit()

      ActivityLogger.logCreate(auth.user?.id, this.modInstance, student.name, student.id)
      // Return a success response
      return response.status(201).json(
        RequestResponse.success(
          {
            student,
            chosenClass,
            parent,
            payment,
            pricing,
            studclass,
          },
          'Student, parent, and payment created successfully'
        )
      )
    } catch (error) {
      // Rollback the transaction in case of an error
      await trx.rollback()
      return response
        .status(500)
        .json(RequestResponse.failure(error.message, 'Failed to create student'))
    }
  }
}
