import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { parentValidator } from '#validators/parent'
import { errors } from '@vinejs/vine'
import Parent from '#models/parent'

export default class ParentsController {
  async index({ response }: HttpContext) {
    const parents = await Parent.all()
    if (parents.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No parents found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(parents, 'Parents fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(parentValidator)

      const parent = await Parent.create(data)

      return response
        .status(201)
        .json(RequestResponse.success(parent, 'Parent created successfully'))
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
    const parent = await Parent.query().where('id', params.id).first()
    if (!parent) {
      return response.status(404).json(RequestResponse.failure(null, 'Parent not found'))
    }
    return response.status(200).json(RequestResponse.success(parent, 'Parent fetched successfully'))
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const parent = await Parent.find(params.id)
      if (!parent) {
        return response.status(404).json(RequestResponse.failure(null, 'Parent not found'))
      }

      const data = await request.validateUsing(parentValidator)

      parent.merge(data)
      await parent.save()

      return response
        .status(200)
        .json(RequestResponse.success(parent, 'Parent updated successfully'))
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
    const parent = await Parent.find(params.id)
    if (!parent) {
      return response.status(404).json(RequestResponse.failure(null, 'Parent not found'))
    }
    await parent.delete()
    return response.status(200).json(RequestResponse.success(null, 'Parent deleted successfully'))
  }
}
