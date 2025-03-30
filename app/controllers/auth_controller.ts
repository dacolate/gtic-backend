// import User from '#models/user'
// import { loginValidator, registerValidator } from '#validators/auth'
// import type { HttpContext } from '@adonisjs/core/http'
// import { RequestResponse } from '../../types.js'
// import { errors } from '@vinejs/vine'

// export default class AuthController {
//   async register({ request, response }: HttpContext) {
//     try {
//       const data = await request.validateUsing(registerValidator)

//       // Check if user already exists
//       const existingEmail = await User.findBy('email', data.email)
//       const existingName = await User.findBy('name', data.name)
//       if (existingEmail || existingName) {
//         return response
//           .status(400)
//           .json(RequestResponse.failure(null, 'Email or name already taken'))
//       }

//       // Create user in the database
//       const user = await User.create(data)

//       const userResponse = {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         created_at: user.createdAt,
//         updated_at: user.updatedAt,
//       }

//       // Respond with success message and user data
//       return response
//         .status(201)
//         .json(RequestResponse.success(userResponse, 'User registered successfully'))
//     } catch (error) {
//       // Catch validation errors
//       if (error instanceof errors.E_VALIDATION_ERROR) {
//         return response
//           .status(422)
//           .json(RequestResponse.failure(error.messages, 'Validation failed'))
//       }

//       // Catch unexpected errors
//       return response
//         .status(500)
//         .json(RequestResponse.failure(null, 'An unexpected error occurred'))
//     }
//   }

//   async login({ request, response }: HttpContext) {
//     try {
//       const { email, password } = await request.validateUsing(loginValidator)

//       // Check user credentials
//       const user = await User.verifyCredentials(email, password)
//       if (!user) {
//         return response.status(401).json(RequestResponse.failure(null, 'Invalid email or password'))
//       }
//       // Create JWT token
//       const token = await User.accessTokens.create(user)

//       // response.plainCookie('authToken', token, {
//       //   httpOnly: true,
//       //   sameSite: 'lax',
//       //   secure: process.env.NODE_ENV === 'production',
//       //   path: '/',
//       //   encode: true,
//       // })

//       const responseData = {
//         name: user.name,
//         role: user.role,
//         email: user.email,
//         token: token,
//       }

//       // Respond with success and token
//       return response.ok(RequestResponse.success(responseData, 'Login successful'))
//     } catch (error) {
//       // Catch validation errors
//       if (error instanceof errors.E_VALIDATION_ERROR) {
//         return response
//           .status(423)
//           .json(RequestResponse.failure(error.messages, 'Validation failed'))
//       }

//       // Catch unexpected errors

//       try {
//         const { email, password } = await request.validateUsing(loginValidator)

//         // Check user credentials
//         await User.verifyCredentials(email, password)
//       } catch (e) {
//         return response.status(401).json(RequestResponse.failure(null, 'Invalid email or password'))
//       }

//       return response
//         .status(500)
//         .json(RequestResponse.failure(null, 'An unexpected error occurred'))
//     }
//   }

//   async logout({ auth, response }: HttpContext) {
//     try {
//       const user = auth.user!
//       await User.accessTokens.delete(user, user.currentAccessToken.identifier)

//       // Successful logout
//       return response.ok(RequestResponse.success(null, 'Logout successful'))
//     } catch (error) {
//       return response
//         .status(500)
//         .json(RequestResponse.failure(null, 'An error occurred while logging out'))
//     }
//   }

//   // Get current authenticated user
//   async me({ auth, response }: HttpContext) {
//     try {
//       await auth.check()
//       const user = auth.user

//       if (!user) {
//         return response.unauthorized(RequestResponse.failure(null, 'User is not authenticated'))
//       }

//       const userResponse = {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         created_at: user.createdAt,
//         updated_at: user.updatedAt,
//       }
//       const currentAccessToken = user.currentAccessToken
//       const tokenResponse = {
//         created_at: currentAccessToken.createdAt,
//         expired: currentAccessToken.expiresAt,
//         lastused_at: currentAccessToken.lastUsedAt,
//       }

//       // Respond with user data
//       return response.ok(
//         RequestResponse.success({ userResponse, tokenResponse }, 'User data fetched successfully')
//       )
//     } catch (error) {
//       return response
//         .status(500)
//         .json(RequestResponse.failure(null, 'An unexpected error occurred'))
//     }
//   }
// }
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
// import { DateTime } from 'luxon'

export default class AuthController {
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

      const user = await User.create(data)

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      }

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
        },
      }

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

  // async refresh({ auth, request, response }: HttpContext) {
  //   try {
  //     const refreshToken = request.input('refresh_token')
  //     const token = await User.accessTokens.createUsingRefreshToken(refreshToken, {
  //       expiresIn: '24 hours',
  //     })

  //     return response.json({
  //       success: true,
  //       token: token.value!.release(),
  //     })
  //   } catch (error) {
  //     return response.unauthorized({
  //       success: false,
  //       message: 'Invalid refresh token',
  //     })
  //   }
  // }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

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
