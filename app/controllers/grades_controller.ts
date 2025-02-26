import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Grade from '#models/grade'
import { gradeValidator } from '#validators/grade'

export default class GradesController {
  async index({ response }: HttpContext) {
    const grades = await Grade.query().preload('classes', (query) =>
      query.preload('teacher').preload('pricing')
    )
    if (grades.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No grades found'))
    }
    return response.status(200).json(RequestResponse.success(grades, 'Grades fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(gradeValidator)

      const grade = await Grade.create(data)

      return response.status(201).json(RequestResponse.success(grade, 'Grade created successfully'))
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

  async update({ params, request, response }: HttpContext) {
    try {
      const grade = await Grade.find(params.id)
      if (!grade) {
        return response.status(404).json(RequestResponse.failure(null, 'grade not found'))
      }

      const data = await request.validateUsing(gradeValidator)

      grade.merge(data)
      await grade.save()

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

  async delete({ params, response }: HttpContext) {
    const grade = await Grade.find(params.id)
    if (!grade) {
      return response.status(404).json(RequestResponse.failure(null, 'Grade not found'))
    }
    await grade.delete()
    return response.status(200).json(RequestResponse.success(null, 'Grade deleted successfully'))
  }
}
