import * as notificationService from '../services/notification.service.js'

export const getNotifications = async (req, res) => {
  const notifications = await notificationService.fetchNotification(req.user._id)
  res.status(200).json(notifications)
}

export const deleteNotification = async (req, res) => {
  await notificationService.removeAllNotification(req.user._id)
  res.status(200).json({ message: 'Notifications deleted successfully' })
}
