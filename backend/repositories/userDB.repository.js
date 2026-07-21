import User from '../models/user.model.js'

export const userDB = {
  findById(id) {
    return User.findById(id)
  },
  findOne(prop) {
    return User.findOne(prop)
  },
  findByEmail(email) {
    return User.findOne({ email })
  },
  create(data) {
    return User.create(data)
  },
}
