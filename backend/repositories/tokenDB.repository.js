import AppError from '../errors/AppError.js'
import RefreshToken from '../models/token.model.js'
import User from '../models/user.model.js'

export const tokenDB = {
  dbTokenCheck(userId, token) {
    return RefreshToken.exists({ userId, token })
  },
  async addDbToken(userId, token, expiresAt) {
    const refreshToken = await RefreshToken.create({ userId, token, expiresAt })
    return User.updateOne({ _id: userId }, { $push: { refreshTokens: refreshToken._id } })
  },
  updateDbToken(decoded, oldRefreshToken, newRefreshToken) {
    return RefreshToken.updateOne(
      { userId: decoded.userId, token: oldRefreshToken },
      {
        $set: {
          token: newRefreshToken,
          expiresAt: new Date(decoded.exp * 1000),
        },
      },
    )
  },
  async deleteDbToken(userId, token) {
    const refreshToken = await RefreshToken.findOneAndDelete({ userId, token })
    return User.updateOne({ _id: userId }, { $pull: { refreshTokens: refreshToken._id } })
  },
}
