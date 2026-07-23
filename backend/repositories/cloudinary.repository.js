import cloudinary from '../config/cloudinary.js'

export const cloudinaryUploader = {
  destroy(profileImg) {
    return cloudinary.uploader.destroy(profileImg.split('/').pop().split('.')[0])
  },
  upload(profileImage) {
    return cloudinary.uploader.upload(profileImage)
  },
}
