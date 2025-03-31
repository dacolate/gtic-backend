import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Class from '#models/class'
import db from '@adonisjs/lucid/services/db'
import Pricing from '#models/pricing'
import StudentClass from '#models/student_class'
import Student from '#models/student'
import { ActivityLogger } from '#services/activity_logger'
// import { classValidator } from '#validators/class'
// import { DateTime } from 'luxon'

export default class ClasssController {
  modInstance = Class
  async index({ response }: HttpContext) {
    const classs = await Class.query()
      .where('active', true)
      .preload('grade', (query) => {
        query.preload('course')
      })
      .preload('teacher')
    if (classs.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No class found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(classs, 'Classes fetched successfully'))
  }

  async indexInactive({ response }: HttpContext) {
    const classs = await Class.query()
      .where('active', false)
      .preload('grade', (query) => {
        query.preload('course')
      })
      .preload('teacher')
    if (classs.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No class found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(classs, 'Classes fetched successfully'))
  }

  async store({ auth, request, response }: HttpContext) {
    const trx = await db.transaction()
    console.log('10')
    try {
      console.log(request)
      // const data = await request.validateUsing(classValidator)
      const payload = request.only([
        'name',
        'description',
        'teacher_id',
        'start_date',
        'expected_duration',
        'grade_id',
        'course_id',
        'registrationFee',
        'firstInstalmentFee',
        'firstInstalmentDeadline',
        'secondInstalmentFee',
        'secondInstalmentDeadline',
      ])
      console.log(payload)

      // Start a database transaction

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

      console.log(pricing)
      const classs = await Class.create(
        {
          name: payload.name,
          description: payload.description,
          teacherId: payload.teacher_id,
          startDate: payload.start_date,
          expectedDuration: payload.expected_duration,
          gradeId: payload.grade_id,
          courseId: payload.course_id,
          pricingId: pricing.id,
        },
        { client: trx }
      )
      console.log(classs)
      // Commit the transaction
      await trx.commit()

      ActivityLogger.logCreate(auth.user?.id, this.modInstance, null, classs.id)

      return response
        .status(201)
        .json(RequestResponse.success({ pricing, classs }, 'Class created successfully'))
    } catch (error) {
      // Catch validation errors
      await trx.rollback()
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, error.messages || 'An unexpected error occurred'))
    }
  }

  async show({ params, response }: HttpContext) {
    const classs = await Class.query()
      .where('id', params.id)
      .preload('grade', (query) => {
        query.preload('course')
      })
      .preload('pricing')
      .preload('teacher')
      .preload('students')
      .first()
    if (!classs) {
      return response.status(404).json(RequestResponse.failure(null, 'Class not found'))
    }
    return response.status(200).json(RequestResponse.success(classs, 'Class fetched successfully'))
  }

  // async update({ params, request, response }: HttpContext) {
  //   try {
  //     const classs = await Class.find(params.id)
  //     if (!classs) {
  //       return response.status(404).json(RequestResponse.failure(null, 'Class not found'))
  //     }

  //     const data = await request.validateUsing(classValidator)

  //     if (data.start_date && data.start_date < DateTime.now()) {
  //       return response
  //         .status(400)
  //         .json(RequestResponse.failure(null, 'Start date cannot be in the past'))
  //     }

  //     classs.merge(data)
  //     await classs.save()

  //     return response
  //       .status(200)
  //       .json(RequestResponse.success(classs, 'Class updated successfully'))
  //   } catch (error) {
  //     // Catch validation errors
  //     if (error instanceof errors.E_VALIDATION_ERROR) {
  //       return response
  //         .status(422)
  //         .json(RequestResponse.failure(error.messages, 'Validation failed'))
  //     }
  //     return response
  //       .status(400)
  //       .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
  //   }
  // }

  // async delete({ params, response }: HttpContext) {
  //   const classs = await Class.find(params.id)
  //   if (!classs) {
  //     return response.status(404).json(RequestResponse.failure(null, 'Class not found'))
  //   }
  //   if (!classs.active) {
  //     await classs.delete()
  //   } else {
  //     // classs.active = false
  //     const students = await classs.related('students').query().where('active', true)
  //     const studentsIds = students.map((student) => student.id)
  //     const studentsToUpdate = await db
  //       .from('students')
  //       .whereIn('id', studentsIds)
  //       .update({ active: false })
  //     const studclassestoUpdate = await StudentClass.query()
  //       .whereIn('student_id', studentsIds)
  //       .update({ active: false })
  //     console.log(studentsIds)
  //     await classs.save()
  //   }
  //   return response.status(200).json(RequestResponse.success(null, 'Class deleted successfully'))
  // }

  async delete({ params, response, auth }: HttpContext) {
    const trx = await db.transaction()

    try {
      const classToDelete = await Class.find(params.id, { client: trx })

      if (!classToDelete) {
        await trx.rollback()
        return response.status(404).json(RequestResponse.failure(null, 'Class not found'))
      }

      if (classToDelete.active) {
        await trx.rollback()
        classToDelete.active = false
        await classToDelete.save()
        return response
          .status(200)
          .json(RequestResponse.success(null, 'Class deactivated successfully'))
      }

      // Get all students in this class (without checking student_classes.active)
      const studentsInClass = await classToDelete
        .useTransaction(trx)
        .related('students')
        .query()
        .where('students.active', true)

      // For each student, check how many classes they have
      for (const student of studentsInClass) {
        const classesCount = await StudentClass.query({ client: trx }).where(
          'student_id',
          student.id
        )

        // If student only has this one class, deactivate them
        if (classesCount.length === 1) {
          await Student.query({ client: trx }).where('id', student.id).update({ active: false })
        }
      }

      // Delete the student-class relationships for this class
      await StudentClass.query().where('class_id', classToDelete.id).useTransaction(trx).delete()

      // Deactivate the class itself
      classToDelete.active = false
      await classToDelete.useTransaction(trx).save()

      await trx.commit()
      ActivityLogger.logDelete(auth.user?.id, this.modInstance, null, classToDelete.id)
      return response
        .status(200)
        .json(RequestResponse.success(null, 'Class deactivated successfully'))
    } catch (error) {
      await trx.rollback()
      return response.status(500).json(RequestResponse.failure(null, 'Failed to deactivate class'))
    }
  }
}
