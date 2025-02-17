import Activity from '#models/activity'
import Attendance from '#models/attendance'
import Class from '#models/class'
import Course from '#models/course'
import Grade from '#models/grade'
import Parent from '#models/parent'
import Payment from '#models/payment'
import Pricing from '#models/pricing'
import Student from '#models/student'
import StudentClass from '#models/student_class'
import Teacher from '#models/teacher'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await User.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: 'password',
      })),
    ])

    // Seed pricings table
    await Pricing.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        description: `Pricing plan ${i + 1}`,
        register_fee: (i + 1) * 50,
        instalment_1_deadline: DateTime.now().plus({ days: 30 + 5 * i }),
        instalment_1_fee: (i + 1) * 100,
        instalment_2_deadline: DateTime.now().plus({ days: 60 + 5 * i }),
        instalment_2_fee: (i + 1) * 150,
      })),
    ])
    // Seed courses table
    await Course.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `Course ${i + 1}`,
        description: `This is course ${i + 1}`,
      })),
    ])

    // Seed grades table
    await Grade.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `Grade ${i + 1}`,
        description: `Description for grade ${i + 1}`,
        course_id: i + 1,
        pricing_id: i + 1,
      })),
    ])

    await Student.createMany(
      Array.from({ length: 10 }, (_, i) => ({
        name: `Student ${i + 1}`,
        phone: `+1234567890${i + 1}`, // Ensure a valid international format
        email: `student${i + 1}@gmail.com`,
        address: `Address ${i + 1}`,
        gender: i % 2 === 0 ? ('M' as const) : ('F' as const), // Alternate genders for demo purposes
        cni: `CNI${i + 1}`, // Example CNI value
        nationality: 'CountryName', // Replace with actual country if needed
        birthday: DateTime.fromISO('2000-01-01'), // ISO date string; the validator will transform it
      }))
    )

    await Teacher.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `Teacher ${i + 1}`,
        phone: `0812345678${i + 1}`,
        email: `teacher${i + 1}` + '@gmail.com',
      })),
    ])

    // Seed classes table
    await Class.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `Class ${i + 1}`,
        teacher_id: i + 1,
        expected_duration: 30,
        grade_id: i + 1,
        course_id: i + 1,
      })),
    ])

    // Seed parents table
    await Parent.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `Parent ${i + 1}`,
        phone: `0812345678${i + 1}`,
        email: `parent${i + 1}` + '@gmail.com',
      })),
    ])

    // Seed activities table
    await Activity.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        user_id: i + 1,
        action: 'create',
        table_name: 'example_table',
        record_id: i + 1,
      })),
    ])

    // Seed payments table
    await Payment.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        student_id: i + 1,
        class_id: i + 1,
        amount: (i + 1) * 100,
      })),
    ])

    // Seed attendances table
    await Attendance.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        student_id: i + 1,
        class_id: i + 1,
        presence: true,
      })),
    ])
    // @ts-expect-error
    await StudentClass.createMany([
      ...Array.from({ length: 10 }, (_, i) => ({
        student_id: i + 1,
        class_id: i + 1,
      })),
    ])
  }
}
