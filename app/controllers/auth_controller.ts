import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import { ActivityLogger } from '#services/activity_logger'
// import { DateTime } from 'luxon'

export default class AuthController {
  modInstance = User
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      const existingEmail = await User.findBy('email', data.email)
      const existingName = await User.findBy('name', data.name)
      if (existingEmail || existingName) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Email or name already taken'))
      }
      data.role = data.role ? data.role : 'user'
      const user = await User.create(data)

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      }

      ActivityLogger.logCreate(user.id, this.modInstance, user.name, undefined)

      return response
        .status(201)
        .json(RequestResponse.success(userResponse, 'User registered successfully'))
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }

      return response
        .status(500)
        .json(RequestResponse.failure(null, 'An unexpected error occurred'))
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      // console.log('test2', User.table)

      if (!user) {
        return response.status(401).json(RequestResponse.failure(null, 'Invalid email or password'))
      }

      // Create token with 24h expiration
      const token = await User.accessTokens.create(user)

      const responseData = {
        success: true,
        data: {
          token: token.value!.release(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toLocaleString(),
        },
      }

      ActivityLogger.logUpdate(user.id, this.modInstance, user.name, undefined)

      return response.ok(responseData)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }

      return response.status(401).json(RequestResponse.failure(null, 'Invalid credentials'))
    }
  }

  async verify({ auth, response }: HttpContext) {
    try {
      await auth.authenticate()
      return response.json({ valid: true })
    } catch {
      return response.json({ valid: false })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      console.log('test', User.name)
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      // ActivityLogger.logDelete(user, this.modInstance, null, undefined)

      return response.json(RequestResponse.success(null, 'Logout success'))
    } catch (error) {
      return response.status(500).json(RequestResponse.failure(null, 'Logout failed'))
    }
  }

  async me({ auth, response }: HttpContext) {
    try {
      await auth.authenticate()
      const user = auth.user!

      return response.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: 'Unauthorized',
      })
    }
  }
}
