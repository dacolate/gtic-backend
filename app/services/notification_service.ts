import Notification from '#models/notification'
import Payment from '#models/payment'
import { DateTime } from 'luxon'

export default class NotificationService {
  public static async create(
    userId: number,
    payload: {
      title: string
      message: string
      type: 'student' | 'class' | 'payment'
      admin?: boolean
    }
  ) {
    return await Notification.create({
      userId,
      isRead: false,
      admin: payload.admin || false,
      ...payload,
    })
  }

  public static async markAsRead(notificationId: number, userId: number) {
    const notification = await Notification.query()
      .where('id', notificationId)
      .where('user_id', userId)
      .firstOrFail()

    notification.isRead = true
    await notification.save()
    return notification
  }

  public static async getUserNotifications(userId: number) {
    return await Notification.query().where('user_id', userId).orderBy('created_at', 'desc')
    // .paginate(page, limit)
  }

  public static async getAdminNotifications() {
    // return await Notification.query().orderBy('created_at', 'desc')
    // .paginate(page, limit)
    const groupedNotifications = await Notification.query()
      .distinctOn('message', 'title')
      .orderBy('message')
      .orderBy('title')
      .orderBy('id', 'desc') // Keep the latest of the duplicates

    return groupedNotifications
  }

  public static async createDailyPaymentsTallyNotification(userId: number | undefined) {
    console.log('userId', userId)
    if (!userId) {
      throw new Error('User ID is required to create a notification')
    }

    const yesyesterday = DateTime.now().minus({ days: 2 }).toISODate()
    const today = DateTime.now().toISODate()
    const yesterday = DateTime.now().minus({ days: 1 }).toISODate()

    // Check if we already created today's notification (for idempotency)
    const alreadyNotifiedToday = await Notification.query()
      .where('title', 'Daily Payments Tally')
      .where('user_id', userId)
      .where('created_at', '>=', `${today}T00:00:00`)
      .first()

    console.log('alreadyNotifiedToday', alreadyNotifiedToday)

    if (alreadyNotifiedToday) {
      return null
    }

    // Check if yesterday's notification exists (prevent duplicate work)
    const yesterdayNotificationExists = await Notification.query()
      .where('title', 'Daily Payments Tally')
      .where('user_id', userId)
      .where('created_at', '>=', `${yesyesterday}T00:00:00`)
      .where('created_at', '<', `${yesterday}T00:00:00`)
      .first()

    console.log('yesterday', yesterday)

    console.log('yesterdayNotificationExists', yesterdayNotificationExists)

    if (yesterdayNotificationExists) {
      return null
    }

    // Calculate yesterday's payments
    const yesterdayStart = `${yesterday}T00:00:00`
    const yesterdayEnd = `${yesterday}T23:59:59`
    const payments = await Payment.query()
      .where('created_at', '>=', yesterdayStart)
      .where('created_at', '<=', yesterdayEnd)

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const paymentCount = payments.length

    return this.create(userId, {
      title: 'Daily Payments Tally',
      message: `Yesterday's payments (${yesterday}): ${paymentCount} transactions totaling $${totalAmount.toFixed(2)}`,
      type: 'payment',
      admin: true,
    })
  }
}
