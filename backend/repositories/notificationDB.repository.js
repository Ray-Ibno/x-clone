import Notification from '../models/notification.model'

export const notificationDB = {
  newNotification(type, userId, targetUserId) {
    return Notification.create({
      type,
      from: userId,
      to: targetUserId,
    })
  },
}
