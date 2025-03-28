export type ClassSchema = {
  name: string
  description?: string
  teacher_id: number
  start_date: Date
  expected_duration: number
  grade_id: number
  course_id: number
  registrationFee: number
  firstInstalmentFee: number
  firstInstalmentDeadline: Date
  secondInstalmentFee: number
  secondInstalmentDeadline: Date
}
