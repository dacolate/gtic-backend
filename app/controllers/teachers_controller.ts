import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Teacher from '#models/teacher'
import { teacherValidator } from '#validators/teacher'
import { ActivityLogger } from '#services/activity_logger'

export default class TeachersController {
  modInstance = Teacher
  async index({ response }: HttpContext) {
    // const teachers = await Teacher.all()

    const teachers = await Teacher.query().preload('classes', (classQuery) => {
      classQuery.preload('course').preload('grade')
    })

    if (teachers.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No teachers found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(teachers, 'Teachers fetched successfully'))
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(teacherValidator)

      const teacher = await Teacher.create(data)

      ActivityLogger.logCreate(auth.user?.id, this.modInstance, null, teacher.id)

      return response
        .status(201)
        .json(RequestResponse.success(teacher, 'Teacher created successfully'))
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
    const teacher = await Teacher.query()
      .where('id', params.id)
      .preload('classes', (classQuery) => {
        classQuery.preload('course').preload('grade')
      })
      .first()
    if (!teacher) {
      return response.status(404).json(RequestResponse.failure(null, 'Teacher not found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(teacher, 'Teacher fetched successfully'))
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const teacher = await Teacher.find(params.id)
      if (!teacher) {
        return response.status(404).json(RequestResponse.failure(null, 'teacher not found'))
      }

      const data = await request.validateUsing(teacherValidator)

      teacher.merge(data)
      await teacher.save()
      ActivityLogger.logUpdate(auth.user?.id, this.modInstance, null, teacher.id)
      return response
        .status(200)
        .json(RequestResponse.success(teacher, 'Teacher updated successfully'))
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
    const teacher = await Teacher.find(params.id)
    if (!teacher) {
      return response.status(404).json(RequestResponse.failure(null, 'Teacher not found'))
    }
    await teacher.delete()
    ActivityLogger.logDelete(auth.user?.id, this.modInstance, null, teacher.id)
    return response.status(200).json(RequestResponse.success(null, 'Teacher deleted successfully'))
  }
}
