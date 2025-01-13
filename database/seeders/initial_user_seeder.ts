import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.create({
      name: 'admin',
      email: 'admin@gmail.com',
      password: '00000000',
      role: 'admin',
    })
  }
}
