import Pricing from '#models/pricing'
import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { pricingValidator } from '#validators/pricing'
import { errors } from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class PricingsController {
  async index({ response }: HttpContext) {
    const pricings = await Pricing.all()
    if (pricings.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No pricings found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(pricings, 'Pricings fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(pricingValidator)

      if (data.instalment_1_deadline > data.instalment_2_deadline) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Deadline 1 can not be before Deadline 2'))
      }

      if (
        data.instalment_1_deadline < DateTime.now() &&
        data.instalment_2_deadline < DateTime.now()
      ) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Deadlines can not be in the past'))
      }
      // Check for an existing row with the same values
      const existingPricing = await Pricing.query()
        // .where('description', data.description || '')
        .where('register_fee', data.register_fee)
        .where('instalment_1_fee', data.instalment_1_fee)
        .where('instalment_2_fee', data.instalment_2_fee)
        .where('instalment_1_deadline', data.instalment_1_deadline.toISODate() || '')
        .where('instalment_2_deadline', data.instalment_2_deadline.toISODate() || '')
        .first()

      if (existingPricing) {
        return response
          .status(409)
          .json(
            RequestResponse.failure(
              null,
              'A pricing record with the exact same values already exists'
            )
          )
      }
      const pricing = await Pricing.create(data)

      return response
        .status(201)
        .json(RequestResponse.success(pricing, 'Pricing created successfully'))
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
    const pricing = await Pricing.query().where('id', params.id).first()
    if (!pricing) {
      return response.status(404).json(RequestResponse.failure(null, 'Pricing not found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(pricing, 'Pricing fetched successfully'))
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const pricing = await Pricing.find(params.id)
      if (!pricing) {
        return response.status(404).json(RequestResponse.failure(null, 'Pricing not found'))
      }

      const data = await request.validateUsing(pricingValidator)
      if (data.instalment_1_deadline > data.instalment_2_deadline) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Deadline 1 can not be before Deadline 2'))
      }

      if (
        data.instalment_1_deadline < DateTime.now() &&
        data.instalment_2_deadline < DateTime.now()
      ) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Deadlines can not be in the past'))
      }
      // Check for an existing row with the same values
      const existingPricing = await Pricing.query()
        // .where('description', data.description || '')
        .where('register_fee', data.register_fee)
        .where('instalment_1_fee', data.instalment_1_fee)
        .where('instalment_2_fee', data.instalment_2_fee)
        .where('instalment_1_deadline', data.instalment_1_deadline.toISODate() || '')
        .where('instalment_2_deadline', data.instalment_2_deadline.toISODate() || '')
        .first()

      if (existingPricing) {
        return response
          .status(409)
          .json(
            RequestResponse.failure(
              null,
              'A pricing record with the exact same values already exists'
            )
          )
      }

      pricing.merge(data)
      await pricing.save()

      return response
        .status(200)
        .json(RequestResponse.success(pricing, 'Pricing updated successfully'))
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
    const pricing = await Pricing.find(params.id)
    if (!pricing) {
      return response.status(404).json(RequestResponse.failure(null, 'Pricing not found'))
    }
    await pricing.delete()
    return response.status(200).json(RequestResponse.success(null, 'Pricing deleted successfully'))
  }
}
