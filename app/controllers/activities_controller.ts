// import type { HttpContext } from '@adonisjs/core/http'

import Activity from '#models/activity'
import { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'

export default class ActivitiesController {
  async index({ response }: HttpContext) {
    const activities = await Activity.query()

    if (activities.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No activity found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(activities, 'Activities fetched successfully'))
  }

  async show({ params, response }: HttpContext) {
    const activities = await Activity.query().where('user_id', params.id)

    if (!activities) {
      return response
        .status(404)
        .json(RequestResponse.failure(null, 'Activities not found for this user'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(activities, 'Activities fetched successfully for this user'))
  }
}
