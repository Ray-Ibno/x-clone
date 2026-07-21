import Notification from '../models/notification.model.js'

export const fetchNotification = async (userId) => {
  //GET CACHED NOTIFICATIONS HERE
  const notifications = await Notification.find({ to: userId })
    .populate({ path: 'from', select: 'username profileImg' })
    .exec()

  await Notification.updateMany({ to: userId }, { read: true })
  //SET CACHE HERE
  return notifications
}

export const removeAllNotification = (userId) => {
  //DELETE CACHE HERE
  return Notification.deleteMany({ to: userId })
}
