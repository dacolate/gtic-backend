// import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import { updateUserValidator } from '#validators/auth'
// import { ActivityLogger } from '#services/activity_logger'

export default class UsersController {
  // modInstance = User
  async update({ params, request, auth, response }: HttpContext) {
    try {
      const loggedInUser = auth.user!

      //Get the user to be updated
      const userIdToEdit = params.id
      const userToEdit = await User.find(userIdToEdit)

      if (!userToEdit) {
        return response.notFound(RequestResponse.failure(null, 'User not found'))
      }

      //Check permissions

      if (
        loggedInUser.role === 'user' &&
        loggedInUser.id !== userToEdit.id // Users can only edit their own credentials
      ) {
        return response.unauthorized(RequestResponse.failure(null, 'Access denied. Admins only'))
      }

      if (
        loggedInUser.role === 'admin' &&
        userToEdit.role === 'admin' &&
        loggedInUser.id !== userToEdit.id // Admins can not edit other admins credentials
      ) {
        return response.unauthorized(
          RequestResponse.failure(null, 'You can not edit credentials for other admins')
        )
      }

      const data = await request.validateUsing(updateUserValidator)

      // Check if user already exists
      const existingEmail = await User.findBy('email', data.email)
      const existingName = await User.findBy('name', data.name)
      if (existingEmail || existingName) {
        return response
          .status(400)
          .json(RequestResponse.failure(null, 'Email or name already taken'))
      }
      // //Users can't change their role
      // if (data.role && data.role !== userToEdit.role) {
      //   return response.badRequest(
      //     RequestResponse.failure(null, 'Role changes are not allowed via this endpoint')
      //   )
      // }
      await userToEdit.merge(data)

      await userToEdit.save()

      const userResponse = {
        id: userToEdit.id,
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        created_at: userToEdit.createdAt,
        updated_at: userToEdit.updatedAt,
      }

      // ActivityLogger.logCreate(auth.user?.id, this.modInstance, null, userResponse.id)

      return response.ok(RequestResponse.success(userResponse, 'User updated sucessfully'))
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

  async delete({ params, auth, response }: HttpContext) {
    try {
      const loggedInUser = auth.user!

      //Get the user to be deleted
      const userIdToDelete = params.id
      const userToDelete = await User.find(userIdToDelete)

      if (!userToDelete) {
        return response.notFound(RequestResponse.failure(null, 'User not found'))
      }

      //Check permissions

      if (
        loggedInUser.role === 'user' // Users can not delete anything
      ) {
        return response.unauthorized(RequestResponse.failure(null, 'Access denied. Admins only'))
      }

      if (
        loggedInUser.role === 'admin' &&
        userToDelete.role === 'admin' // Admins can not delete himself or other admins
      ) {
        return response.unauthorized(
          RequestResponse.failure(null, 'You can not delete yourself or other admins')
        )
      }

      const userResponse = {
        id: userToDelete.id,
        name: userToDelete.name,
        email: userToDelete.email,
        role: userToDelete.role,
        created_at: userToDelete.createdAt,
        updated_at: userToDelete.updatedAt,
      }

      await userToDelete.delete()

      // ActivityLogger.logDelete(auth.user?.id, this.modInstance, null, userResponse.id)

      return response.ok(RequestResponse.success(userResponse, 'User deleted sucessfully'))
    } catch (error) {
      // Catch unexpected errors
      return response
        .status(500)
        .json(RequestResponse.failure(null, 'An unexpected error occurred'))
    }
  }

  async fetch({ params, auth, response }: HttpContext) {
    try {
      const loggedInUser = auth.user!
      // console.log('loggedid', loggedInUser)

      //Get the user to be updated
      const userIdToFetch = params.id
      const userToFetch = await User.find(userIdToFetch)

      if (!userToFetch) {
        return response.notFound(RequestResponse.failure(null, 'User not found'))
      }

      //Check permissions

      if (
        loggedInUser.role === 'user' // Users can not fetch users data
      ) {
        return response.unauthorized(RequestResponse.failure(null, 'Access denied. Admins only'))
      }

      const userResponse = {
        id: userToFetch.id,
        name: userToFetch.name,
        email: userToFetch.email,
        role: userToFetch.role,
        created_at: userToFetch.createdAt,
        updated_at: userToFetch.updatedAt,
      }

      return response.ok(RequestResponse.success(userResponse, 'User data fetched sucessfully'))
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

  async fetchAll({ auth, response }: HttpContext) {
    try {
      const loggedInUser = auth.user!
      // console.log('logged', loggedInUser)

      //Get the user to be updated
      const users = await User.query().whereNot('id', loggedInUser.id)

      const userResponses = users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        }
      })

      if (!users) {
        return response.notFound(RequestResponse.failure(null, 'No users found'))
      }

      //Check permissions

      if (
        loggedInUser.role === 'user' // Users can not fetch users data
      ) {
        return response.unauthorized(RequestResponse.failure(null, 'Access denied. Admins only'))
      }

      return response.ok(
        RequestResponse.success(userResponses, 'All Users data fetched sucessfully')
      )
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
}
