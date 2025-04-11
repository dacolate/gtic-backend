import Class from '#models/class'
import Notification from '#models/notification'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class ClassNotificationService {
  public static async createUpcomingClassEndNotifications() {
    const sevenDaysFromNow = DateTime.now().plus({ days: 7 }).toISODate()

    // Find classes ending in exactly 7 days
    // const endingClasses = await Class.query()
    //   .where('active', true)
    //   .whereRaw("start_date + expected_duration * INTERVAL '1 day' = ?", [sevenDaysFromNow])
    //   .preload('teacher')
    //   .preload('students')

    const endingClasses = await Class.query()
      .where('active', true)
      .whereRaw("start_date + expected_duration * INTERVAL '1 day' <= ?", [sevenDaysFromNow])
      .whereRaw("start_date + expected_duration * INTERVAL '1 day' >= CURRENT_DATE")
      .preload('teacher')
      .preload('students')

    endingClasses.map((classs) => console.log('Classes ending in 7 daysss:', classs.toJSON()))

    const users = await User.query().select('id')

    users.map((user) => {
      endingClasses.map((classItem) => {
        this.createClassEndingNotification(
          user.id,
          classItem,
          `Class ${classItem.name} is ending soon`
        ).catch((error) => console.log(error))
      })
    })
  }

  private static async createClassEndingNotification(
    userId: number,
    classItem: Class,
    baseMessage: string
  ) {
    const endDate = classItem.startDate.plus({ days: classItem.expectedDuration }).toFormat('DDD')

    // Check if notification already exists
    const exists = await Notification.query()
      .where('user_id', userId)
      .where('type', 'class')
      .where('created_at', '>=', DateTime.now().startOf('day').toSQL())
      .first()

    if (!exists) {
      await Notification.create({
        userId,
        title: 'Class Ending Soon',
        message: `${baseMessage} on ${endDate}.`,
        type: 'class',
        admin: false, // Set to true if you want admin-specific styling
      })
    }
  }

  public static async extend(classId: number, days: number) {
    const classs = await Class.query().where('id', classId).firstOrFail()

    classs.expectedDuration += days
    await classs.save()
    return classs
  }
}
