import NotificationService from '#services/notification_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminDailyCheckMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // First call next to ensure all previous middleware runs
    const output = await next()
    console.log('teeeeeeeeeeeeeeeest')
    try {
      // Safely check for authenticated user
      const user = ctx.auth?.user

      if (!user) {
        console.log('No authenticated user found')
        return output
      }

      // Check if user is admin
      const isAdmin = user.role === 'admin'

      if (isAdmin) {
        await NotificationService.createDailyPaymentsTallyNotification(user.id)
      }

      return output
    } catch (error) {
      console.error('Error in AdminDailyCheckMiddleware:', error)
      return output
    }
  }
}
