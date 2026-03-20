import Notification from '../models/notification.model.js'

export const fetchNotification = async (userId) => {
  const notifications = await Notification.find({ to: userId })
    .populate({ path: 'from', select: 'username profileImg' })
    .exec()

  await Notification.updateMany({ to: userId }, { read: true })
  return notifications
}

export const removeAllNotification = async (userId) => {
  await Notification.deleteMany({ to: userId })
}
