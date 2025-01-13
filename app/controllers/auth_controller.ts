import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      // Check if user already exists
      const existingEmail = await User.findBy('email', data.email)
      const existingName = await User.findBy('name', data.name)
      if (existingEmail || existingName) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Email or name already taken'))
      }

      // Create user in the database
      const user = await User.create(data)

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      }

      // Respond with success message and user data
      return response
        .status(201)
        .json(RequestResponse.success(userResponse, 'User registered successfully'))
    } catch (error) {
      // Catch validation errors
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }

      // Catch unexpected errors
      return response
        .status(500)
        .json(RequestResponse.failure(null, 'An unexpected error occurred'))
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      // Check user credentials
      const user = await User.verifyCredentials(email, password)
      if (!user) {
        return response.status(401).json(RequestResponse.failure(null, 'Invalid email or password'))
      }
      // Create JWT token
      const token = await User.accessTokens.create(user)

      // Respond with success and token
      return response.ok(
        RequestResponse.success({ token, ...user.serialize() }, 'Login successful')
      )
    } catch (error) {
      // Catch validation errors
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }

      // Catch unexpected errors

      try {
        const { email, password } = await request.validateUsing(loginValidator)

        // Check user credentials
        await User.verifyCredentials(email, password)
      } catch (e) {
        return response.status(401).json(RequestResponse.failure(null, 'Invalid email or password'))
      }

      return response
        .status(500)
        .json(RequestResponse.failure(null, 'An unexpected error occurred'))
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      // Successful logout
      return response.ok(RequestResponse.success(null, 'Logout successful'))
    } catch (error) {
      return response
        .status(500)
        .json(RequestResponse.failure(null, 'An error occurred while logging out'))
    }
  }

  // Get current authenticated user
  async me({ auth, response }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user

      if (!user) {
        return response.unauthorized(RequestResponse.failure(null, 'User is not authenticated'))
      }

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      }
      const currentAccessToken = user.currentAccessToken
      const tokenResponse = {
        created_at: currentAccessToken.createdAt,
        expired: currentAccessToken.expiresAt,
        lastused_at: currentAccessToken.lastUsedAt,
      }

      // Respond with user data
      return response.ok(
        RequestResponse.success({ userResponse, tokenResponse }, 'User data fetched successfully')
      )
    } catch (error) {
      return response
        .status(500)
        .json(RequestResponse.failure(null, 'An unexpected error occurred'))
    }
  }
}
