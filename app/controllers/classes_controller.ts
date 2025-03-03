import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Class from '#models/class'
import { classValidator } from '#validators/class'
import { DateTime } from 'luxon'

export default class ClasssController {
  async index({ response }: HttpContext) {
    const classs = await Class.query()
      .preload('grade', (query) => {
        query.preload('course')
      })
      .preload('pricing')
      .preload('teacher')
    if (classs.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No class found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(classs, 'Classes fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(classValidator)

      if (data.start_date && data.start_date < DateTime.now()) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Start date cannot be in the past'))
      }

      const classs = await Class.create(data)

      return response
        .status(201)
        .json(RequestResponse.success(classs, 'Class created successfully'))
    } catch (error) {
      // Catch validation errors
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
      .first()
    if (!classs) {
      return response.status(404).json(RequestResponse.failure(null, 'Class not found'))
    }
    return response.status(200).json(RequestResponse.success(classs, 'Class fetched successfully'))
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const classs = await Class.find(params.id)
      if (!classs) {
        return response.status(404).json(RequestResponse.failure(null, 'Class not found'))
      }

      const data = await request.validateUsing(classValidator)

      if (data.start_date && data.start_date < DateTime.now()) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Start date cannot be in the past'))
      }

      classs.merge(data)
      await classs.save()

      return response
        .status(200)
        .json(RequestResponse.success(classs, 'Class updated successfully'))
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
    const classs = await Class.find(params.id)
    if (!classs) {
      return response.status(404).json(RequestResponse.failure(null, 'Class not found'))
    }
    await classs.delete()
    return response.status(200).json(RequestResponse.success(null, 'Class deleted successfully'))
  }
}
