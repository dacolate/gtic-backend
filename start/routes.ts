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
const StudentClassesController = () => import('#controllers/student_classes_controller')
const NewStudentsController = () => import('#controllers/new_students_controller')
const PaymentController = () => import('#controllers/payments_controller')
const StudentsController = () => import('#controllers/students_controller')
const PricingsController = () => import('#controllers/pricings_controller')
const ParentsController = () => import('#controllers/parents_controller')
const ClasssController = () => import('#controllers/classes_controller')
const TeachersController = () => import('#controllers/teachers_controller')
const GradesController = () => import('#controllers/grades_controller')
const CoursesController = () => import('#controllers/courses_controller')
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

router
  .group(() => {
    router.get(':id', [CoursesController, 'show'])
    router.get('/', [CoursesController, 'index'])
    router.post('/', [CoursesController, 'store'])
    router.put(':id', [CoursesController, 'update'])
    router.delete(':id', [CoursesController, 'delete'])
  })
  .prefix('courses')

router
  .group(() => {
    router.get(':id', [GradesController, 'show'])
    router.get('/', [GradesController, 'index'])
    router.post('/', [GradesController, 'store'])
    router.put(':id', [GradesController, 'update'])
    router.delete(':id', [GradesController, 'delete'])
  })
  .prefix('grades')

router
  .group(() => {
    router.get(':id', [TeachersController, 'show'])
    router.get('/', [TeachersController, 'index'])
    router.post('/', [TeachersController, 'store'])
    router.put(':id', [TeachersController, 'update'])
    router.delete(':id', [TeachersController, 'delete'])
  })
  .prefix('teachers')

router
  .group(() => {
    router.get(':id', [ClasssController, 'show'])
    router.get('/', [ClasssController, 'index'])
    router.post('/', [ClasssController, 'store'])
    router.put(':id', [ClasssController, 'update'])
    router.delete(':id', [ClasssController, 'delete'])
  })
  .prefix('classes')

router
  .group(() => {
    router.get(':id', [ParentsController, 'show'])
    router.get('/', [ParentsController, 'index'])
    router.post('/', [ParentsController, 'store'])
    router.put(':id', [ParentsController, 'update'])
    router.delete(':id', [ParentsController, 'delete'])
  })
  .prefix('parents')

router
  .group(() => {
    router.get(':id', [PricingsController, 'show'])
    router.get('/', [PricingsController, 'index'])
    router.post('/', [PricingsController, 'store'])
    router.put(':id', [PricingsController, 'update'])
    router.delete(':id', [PricingsController, 'delete'])
  })
  .prefix('pricings')

router
  .group(() => {
    router.get(':id', [StudentsController, 'show'])
    router.get('/', [StudentsController, 'index'])
    router.post('/', [StudentsController, 'store'])
    router.put(':id', [StudentsController, 'update'])
    router.delete(':id', [StudentsController, 'delete'])
  })
  .prefix('students')

router
  .group(() => {
    router.get(':id', [PaymentController, 'show'])
    router.get('/', [PaymentController, 'index'])
    router.post('/', [PaymentController, 'store'])
    router.put(':id', [PaymentController, 'update'])
    router.delete(':id', [PaymentController, 'delete'])
  })
  .prefix('payments')

router.post('/', [NewStudentsController, 'store']).prefix('newstudent')

router.post('/', [StudentClassesController, 'store']).prefix('studentclass')
