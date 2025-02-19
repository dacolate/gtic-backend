import Course from '#models/course'
import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { courseValidator } from '#validators/course'
import { errors } from '@vinejs/vine'

export default class CoursesController {
  async index({ response }: HttpContext) {
    const courses = await Course.query()
      .preload('classes')
      .preload('grades', (query) => query.preload('classes').preload('pricing'))
    if (courses.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No courses found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(courses, 'Courses fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(courseValidator)

      const course = await Course.create(data)

      return response
        .status(201)
        .json(RequestResponse.success(course, 'Course created successfully'))
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
    const course = await Course.query()
      .where('id', params.id)
      .preload('classes')
      .preload('grades', (query) => query.preload('classes').preload('pricing'))
      .first()
    if (!course) {
      return response.status(404).json(RequestResponse.failure(null, 'Course not found'))
    }
    return response.status(200).json(RequestResponse.success(course, 'Course fetched successfully'))
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const course = await Course.find(params.id)
      if (!course) {
        return response.status(404).json(RequestResponse.failure(null, 'Course not found'))
      }

      const data = await request.validateUsing(courseValidator)

      course.merge(data)
      await course.save()

      return response
        .status(200)
        .json(RequestResponse.success(course, 'Course updated successfully'))
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
    const course = await Course.find(params.id)
    if (!course) {
      return response.status(404).json(RequestResponse.failure(null, 'Course not found'))
    }
    await course.delete()
    return response.status(200).json(RequestResponse.success(null, 'Course deleted successfully'))
  }
}
