export type User = {
  accessToken: string
  _id: string
  username: string
  fullName: string
  email: string
  profileImg: string
  coverImg?: string
  bio: string
  link: string
  following: string[]
  followers: string[]
  createdAt: string
}

export type UserProfileImageProps = {
  userProfile: User
  isMyProfile: boolean
  imgs: {
    coverImg: string | ArrayBuffer | null
    profileImg: string | ArrayBuffer | null
  }
  setCoverImg: (data: string | ArrayBuffer | null) => void
  setProfileImg: (data: string | ArrayBuffer | null) => void
}
