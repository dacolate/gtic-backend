import Class from '#models/class'
import Grade from '#models/grade'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await Grade.createMany([
      {
        name: `Grade 15`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 16`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 17`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 18`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 19`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 20`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 21`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 22`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 23`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
      {
        name: `Grade 24`,
        description: `Description for grade `,
        courseId: 1,
        pricingId: 1,
      },
    ])

    await Class.createMany([
      {
        name: `Class 15`,
        description: `Description for grade `,
        courseId: 1,
        gradeId: 1,
        teacherId: 1,
        expectedDuration: 30,
      },
      {
        name: `Class 16`,
        description: `Description for grade `,
        courseId: 1,
        gradeId: 1,
        teacherId: 1,
        expectedDuration: 30,
      },
    ])
  }
}
