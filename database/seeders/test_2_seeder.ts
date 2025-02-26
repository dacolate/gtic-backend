import Student from '#models/student'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Student.createMany([
      {
        name: `Student`,
        firstname: '18',
        phone: `+1234567890`,
        email: `student@gmail.com`,
        address: `Address 1`,
        gender: 'M' as const,
        cni: 'CNI',
        nationality: 'CountryName',
        birthday: DateTime.fromISO('2000-01-01'),
      },
    ])
  }
}
