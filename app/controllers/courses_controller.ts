import Course from '#models/course'
import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { courseValidator } from '#validators/course'
import { errors } from '@vinejs/vine'
import { ActivityLogger } from '#services/activity_logger'

export default class CoursesController {
  modInstance = Course
  async index({ response }: HttpContext) {
    const courses = await Course.query()
      .preload('classes', (query) => query.preload('teacher').preload('pricing'))
      .preload('grades', (query) =>
        query
          .preload('classes', (quer) => quer.preload('teacher').preload('pricing'))
          .preload('pricing')
      )
    if (courses.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No courses found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(courses, 'Courses fetched successfully'))
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(courseValidator)

      const course = await Course.create(data)

      ActivityLogger.logCreate(auth.user?.id, this.modInstance, null, course.id)

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
      .preload('classes', (query) => query.preload('teacher').preload('pricing'))
      .preload('grades', (query) =>
        query
          .preload('classes', (quer) => quer.preload('teacher').preload('pricing'))
          .preload('pricing')
      )
      .first()
    if (!course) {
      return response.status(404).json(RequestResponse.failure(null, 'Course not found'))
    }
    return response.status(200).json(RequestResponse.success(course, 'Course fetched successfully'))
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const course = await Course.find(params.id)
      if (!course) {
        return response.status(404).json(RequestResponse.failure(null, 'Course not found'))
      }

      const data = await request.validateUsing(courseValidator)

      course.merge(data)
      await course.save()
      ActivityLogger.logUpdate(auth.user?.id, this.modInstance, null, course.id)

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

  async delete({ auth, params, response }: HttpContext) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.status(404).json(RequestResponse.failure(null, 'Course not found'))
    }
    ActivityLogger.logUpdate(auth.user?.id, this.modInstance, null, course.id)
    await course.delete()
    return response.status(200).json(RequestResponse.success(null, 'Course deleted successfully'))
  }
}
