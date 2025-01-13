import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { RequestResponse } from '../../types.js'

export default class IsAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await ctx.auth.user

    if (user?.role !== 'admin') {
      return ctx.response.forbidden(RequestResponse.failure(null, 'Access denied. Admins only.'))
    }

    // Allow the request to continue if the user is an admin
    await next()
  }
}
