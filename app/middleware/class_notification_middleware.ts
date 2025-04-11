import ClassNotificationService from '#services/class_notification_service'
import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ClassNotificationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const output = await next()
    console.log('MADDDDDDDDDDDDDDDDDDD')
    console.log(ctx)
    // Run in background without blocking response
    ClassNotificationService.createUpcomingClassEndNotifications().catch((error) =>
      console.error('Class notification error:', error)
    )

    return output
  }
}
