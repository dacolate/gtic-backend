/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { RequestResponse } from '../types.js'
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

// Root route
router.get('/', async () => {
  return RequestResponse.success(null, 'API is working')
})

// Authentication routes
router
  .group(() => {
    router
      .post('register', [AuthController, 'register'])
      .use([middleware.auth(), middleware.isAdmin()]) // Registration
    router.post('login', [AuthController, 'login']) // Login
    router.delete('logout', [AuthController, 'logout']).use(middleware.auth()) // Logout
    router.get('me', [AuthController, 'me']).use([middleware.auth()]) // Get current user
  })
  .prefix('auth')

// User management routes
router
  .group(() => {
    router.put(':id', [UsersController, 'update']).use([middleware.auth(), middleware.isAdmin()]) // Update user
    router.delete(':id', [UsersController, 'delete']).use([middleware.auth(), middleware.isAdmin()]) // Delete user
    router.get(':id', [UsersController, 'fetch']).use([middleware.auth(), middleware.isAdmin()])
    router.get('/', [UsersController, 'fetchAll']).use([middleware.auth(), middleware.isAdmin()])
  })
  .prefix('users')
