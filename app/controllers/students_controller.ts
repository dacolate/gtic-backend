import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { studentValidator } from '#validators/student'
import { errors } from '@vinejs/vine'
import Student from '#models/student'

export default class StudentsController {
  async index({ response }: HttpContext) {
    const students = await Student.all()
    if (students.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No students found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(students, 'Students fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(studentValidator)

      const student = await Student.create(data)

      return response
        .status(201)
        .json(RequestResponse.success(student, 'Student created successfully'))
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
    const student = await Student.query().where('id', params.id).first()
    if (!student) {
      return response.status(404).json(RequestResponse.failure(null, 'Student not found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(student, 'Student fetched successfully'))
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const student = await Student.find(params.id)
      if (!student) {
        return response.status(404).json(RequestResponse.failure(null, 'Student not found'))
      }

      const data = await request.validateUsing(studentValidator)

      student.merge(data)
      await student.save()

      return response
        .status(200)
        .json(RequestResponse.success(student, 'Student updated successfully'))
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
    const student = await Student.find(params.id)
    if (!student) {
      return response.status(404).json(RequestResponse.failure(null, 'Student not found'))
    }
    await student.delete()
    return response.status(200).json(RequestResponse.success(null, 'Student deleted successfully'))
  }
}
