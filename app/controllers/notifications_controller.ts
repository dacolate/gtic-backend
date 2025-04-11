import NotificationService from '#services/notification_service'
import { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'

export default class NotificationsController {
  public async index({ auth }: HttpContext) {
    // const page = request.input('page', 1)
    // const limit = request.input('limit', 10)

    const notifs = await NotificationService.getUserNotifications(auth.user!.id)

    return RequestResponse.success(notifs, 'Notifications fetched successfully')
  }

  public async markAsRead({ auth, params }: HttpContext) {
    await NotificationService.markAsRead(params.id, auth.user!.id)
    return RequestResponse.success(null, 'Notifications marked as read')
  }

  // public async create({ request }: HttpContext) {
  //   const payload = request.only(['title', 'message', 'type', 'admin'])

  //   await NotificationService.create(request.input('userId'), payload)

  //   return RequestResponse.success(null, 'Notifications fetched successfully')
  // }
}
