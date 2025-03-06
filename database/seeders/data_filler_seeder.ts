import Class from '#models/class'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const hours = Array.from({ length: 9 }, (_, i) => 8 + i) // Generates [8, 9, 10, ..., 16]

    await Class.createMany(
      hours.map((hour, index) => ({
        name: `${hour}h-${hour + 2}h`,
        teacherId: 1,
        expectedDuration: 30,
        gradeId: 22 + index, // Matches the given grade IDs
        courseId: index < 7 ? 11 : 12, // First 7 belong to course 11, rest to 12
      }))
    )
  }
}
