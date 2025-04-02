import Activity from '#models/activity'

import { LucidModel } from '@adonisjs/lucid/types/model'

export class ActivityLogger {
  static async log({
    userId,
    action,
    tableName,

    description = null,
    recordId,
  }: {
    userId: number | undefined
    action: string
    tableName: string
    recordId: number | undefined
    description?: string | null
  }) {
    if (userId) {
      await Activity.create({
        userId,
        action,
        tableName,
        recordId,
        description,
      })
    }
  }

  static async logCreate(
    id: number | undefined,
    modelInstance: LucidModel,
    description: string | undefined,
    recordId: number | undefined
  ) {
    console.log('tdh')
    await this.log({
      userId: id,
      action: 'create',
      tableName: modelInstance.name,
      description,
      recordId,
    })
  }

  static async logUpdate(
    id: number | undefined,
    modelInstance: LucidModel,
    description: string | undefined,
    recordId: number | undefined
  ) {
    console.log('tdhhhdh')
    await this.log({
      userId: id,
      action: 'update',
      tableName: modelInstance.name,
      description,
      recordId,
    })
  }

  static async logDelete(
    id: number | undefined,
    modelInstance: LucidModel,
    description: string | undefined,
    recordId: number | undefined
  ) {
    console.log('now')
    await this.log({
      userId: id,
      action: 'delete',
      tableName: modelInstance.name,
      description,
      recordId,
    })
  }
}
