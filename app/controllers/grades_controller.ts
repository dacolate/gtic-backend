import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Grade from '#models/grade'
import { createGradeValidator, gradeValidator } from '#validators/grade'
import db from '@adonisjs/lucid/services/db'
import Pricing from '#models/pricing'
import Course from '#models/course'
import { ActivityLogger } from '#services/activity_logger'

export default class GradesController {
  modInstance = Grade
  async index({ response }: HttpContext) {
    const grades = await Grade.query().preload('classes', (query) =>
      query.preload('teacher').preload('pricing')
    )
    if (grades.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No grades found'))
    }
    return response.status(200).json(RequestResponse.success(grades, 'Grades fetched successfully'))
  }

  async store({ auth, request, response }: HttpContext) {
    let payload

    // Validate the request data
    try {
      console.log('74')
      payload = await request.validateUsing(createGradeValidator)
      console.log('75')
    } catch (error) {
      console.log(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error)
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
    }

    // Check for existing grade
    try {
      const existingGrade = await Grade.query()
        .where('name', payload.name)
        .andWhere('course_id', payload.courseId)
        .first()

      if (existingGrade) {
        return response
          .status(422)
          .json(
            RequestResponse.failure(
              'Existing grade',
              'Grade with this name already exists for this course'
            )
          )
      }
    } catch (error) {
      return response
        .status(400)
        .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
    }

    // Start transaction
    const trx = await db.transaction()

    try {
      // 1. First create the pricing
      const pricing = await Pricing.create(
        {
          registerFee: payload.registrationFee,
          instalment1Fee: payload.firstInstalmentFee,
          instalment2Fee: payload.secondInstalmentFee,
          instalment1Deadline: payload.firstInstalmentDeadline,
          instalment2Deadline: payload.secondInstalmentDeadline,
        },
        { client: trx }
      )

      // 2. Then create the grade with pricing reference
      const grade = await Grade.create(
        {
          name: payload.name,
          description: payload.description,
          courseId: payload.courseId,
          pricingId: pricing.id,
        },
        { client: trx }
      )

      // 3. Load related course data
      const course = await Course.query().where('id', payload.courseId).first()

      // Commit transaction
      await trx.commit()

      ActivityLogger.logCreate(auth.user?.id, this.modInstance, grade.name, grade.id)

      return response.status(201).json(
        RequestResponse.success(
          {
            grade,
            pricing,
            course,
          },
          'Grade and pricing created successfully'
        )
      )
    } catch (error) {
      // Rollback on error
      await trx.rollback()
      return response
        .status(500)
        .json(RequestResponse.failure(error.message, 'Failed to create grade'))
    }
  }

  async show({ params, response }: HttpContext) {
    const grade = await Grade.query()
      .where('id', params.id)
      .preload('classes', (query) => query.preload('teacher').preload('pricing'))
      .first()
    if (!grade) {
      return response.status(404).json(RequestResponse.failure(null, 'Grade not found'))
    }
    return response.status(200).json(RequestResponse.success(grade, 'Grade fetched successfully'))
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const grade = await Grade.find(params.id)
      if (!grade) {
        return response.status(404).json(RequestResponse.failure(null, 'grade not found'))
      }

      const data = await request.validateUsing(gradeValidator)

      grade.merge(data)
      await grade.save()

      ActivityLogger.logUpdate(auth.user?.id, this.modInstance, grade.name, grade.id)

      return response.status(200).json(RequestResponse.success(grade, 'Grade updated successfully'))
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
  }

  async delete({ auth, params, response }: HttpContext) {
    const grade = await Grade.find(params.id)
    if (!grade) {
      return response.status(404).json(RequestResponse.failure(null, 'Grade not found'))
    }
    await grade.delete()
    ActivityLogger.logDelete(auth.user?.id, this.modInstance, grade.name, grade.id)
    return response.status(200).json(RequestResponse.success(null, 'Grade deleted successfully'))
  }
}
