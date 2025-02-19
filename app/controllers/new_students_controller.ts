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

export default class NewStudentsController {
  async store({ request, response }: HttpContext) {
    let payload

    // Validate the request data and catch validation errors
    try {
      payload = await request.validateUsing(newStudentValidator)
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

    try {
      const studentName = await Student.query().where('name', payload.name).first()
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
      if (studentEmail) {
        return response
          .status(422)
          .json(RequestResponse.failure(studentEmail, 'Existing student email'))
      }
      const studentPhone = payload.phone
        ? await Student.query().where('phone', payload.phone).first()
        : null
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

      // Create the parent
      const parent = await Parent.create(
        {
          name: payload.parentName,
          phone: payload.parentPhone,
          email: payload.parentEmail,
        },
        { client: trx }
      )

      // Create the payment
      const payment = await Payment.create(
        {
          studentId: student.id, // Link the payment to the student
          amount: payload.paymentAmount,
          paymentMethod: payload.paymentMethod,
        },
        { client: trx }
      )

      const chosenClass = await Class.find(payload.class)

      await StudentClass.create(
        {
          studentId: student.id,
          classId: chosenClass?.id,
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

      // Commit the transaction
      await trx.commit()

      // Return a success response
      return response.status(201).json(
        RequestResponse.success(
          {
            student,
            parent,
            payment,
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
