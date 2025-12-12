import { useRef } from 'react'
import type { User } from '../../../types/user-model'
import { MdEdit } from 'react-icons/md'

type UserProfileProps = {
  userProfile: User
  isMyProfile: boolean
  imgs: {
    coverImg: string | ArrayBuffer | null
    profileImg: string | ArrayBuffer | null
  }
  setCoverImg: (data: string | ArrayBuffer | null) => void
  setProfileImg: (data: string | ArrayBuffer | null) => void
}

const UserProfileImages = ({
  userProfile,
  isMyProfile,
  imgs,
  setCoverImg,
  setProfileImg,
}: UserProfileProps) => {
  const coverImgRef = useRef<HTMLInputElement | null>(null)
  const profileImgRef = useRef<HTMLInputElement | null>(null)

  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    state: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          state === 'coverImg' && setCoverImg(reader.result)
          state === 'profileImg' && setProfileImg(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }
  return (
    <div className="relative group/cover">
      {/* COVER IMAGE */}
      <img
        src={
          (typeof imgs.coverImg === 'string' && imgs.coverImg) ||
          userProfile?.coverImg ||
          '/cover.png'
        }
        className="h-52 w-full object-cover"
        alt="cover image"
      />
      {isMyProfile && (
        <div
          className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
          onClick={() => coverImgRef.current && coverImgRef.current.click()}
        >
          <MdEdit className="w-5 h-5 text-white" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImgRef}
        onChange={(e) => handleImgChange(e, 'coverImg')}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImgRef}
        onChange={(e) => handleImgChange(e, 'profileImg')}
      />
      {/* USER AVATAR */}
      <div className="avatar absolute -bottom-16 left-4">
        <div className="w-32 rounded-full relative group/avatar">
          <img
            src={
              (typeof imgs.profileImg === 'string' && imgs.profileImg) ||
              userProfile?.profileImg ||
              '/avatar-placeholder.png'
            }
          />
          <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
            {isMyProfile && (
              <MdEdit
                className="w-4 h-4 text-white"
                onClick={() =>
                  profileImgRef.current && profileImgRef.current.click()
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserProfileImages
