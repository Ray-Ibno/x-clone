import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Posts from '../../components/common/Posts'
import ProfileHeaderSkeleton from '../../components/skeletons/ProfileHeaderSkeleton'
import EditProfileModal from './EditProfileModal'

import { FaArrowLeft } from 'react-icons/fa6'
import { IoCalendarOutline } from 'react-icons/io5'
import { FaLink } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

import type { POST } from '../../types/post-model'

import { feedTypeContext } from '../../context/feedTypeContext'

import useGetPosts from '../../hooks/useGetPosts'
import useGetUser from '../../hooks/useGetUser'
import useFollow from '../../hooks/useFollow'
import useUpdateProfile from '../../features/profile/hooks/useUpdateProfile'
import useGetUserProfile from '../../features/profile/hooks/useGetUserProfile'

import { formatMemberSinceDate } from '../../utils/date'
import Button from '../../components/ui/Button'

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState<string | ArrayBuffer | null>(null)
  const [profileImg, setProfileImg] = useState<string | ArrayBuffer | null>(
    null
  )
  const [feedType, setFeedType] = useState('posts')
  const coverImgRef = useRef<HTMLInputElement | null>(null)
  const profileImgRef = useRef<HTMLInputElement | null>(null)

  const { data: authUser } = useGetUser()
  const { username } = useParams()

  const {
    data: userProfile,
    isLoading,
    isRefetching,
  } = useGetUserProfile(username)

  const { data: post } = useGetPosts()

  const { mutate: follow, isPending } = useFollow(userProfile?._id)
  const { mutate: updateImage, isPending: isUpdating } = useUpdateProfile({
    coverImg,
    profileImg,
  })

  const memberSinceDate = userProfile
    ? formatMemberSinceDate(userProfile.createdAt)
    : ''

  const POSTS = post?.filter((post: POST) => post.user._id === userProfile?._id)

  const isMyProfile = authUser?._id === userProfile?._id
  const isUserFollowedByMe = authUser.following.includes(userProfile?._id)

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

  const getButtonLabel = () => {
    if (isPending && isUserFollowedByMe) return 'Unfollowing...'
    if (isPending && !isUserFollowedByMe) return 'Following...'
    if (!isPending && isUserFollowedByMe) return 'Unfollow'
    if (!isPending && !isUserFollowedByMe) return 'Follow'
  }

  return (
    //feedType context is being used refetching query key
    <feedTypeContext.Provider value={feedType}>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !userProfile && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && userProfile && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{userProfile?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={
                    (typeof coverImg === 'string' && coverImg) ||
                    userProfile?.coverImg ||
                    '/cover.png'
                  }
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() =>
                      coverImgRef.current && coverImgRef.current.click()
                    }
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
                        (typeof profileImg === 'string' && profileImg) ||
                        userProfile?.profileImg ||
                        '/avatar-placeholder.png'
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() =>
                            profileImgRef.current &&
                            profileImgRef.current.click()
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <Button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => {
                      if (isPending) return
                      follow()
                    }}
                    label={`${getButtonLabel()}`}
                  />
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => {
                      updateImage()
                    }}
                  >
                    {isUpdating ? 'Updating...' : 'Update'}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">
                    {userProfile?.fullName}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{userProfile?.username}
                  </span>
                  <span className="text-sm my-1">{userProfile?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {userProfile?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={`${userProfile?.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          ${userProfile?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSinceDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {userProfile?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {userProfile?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer ${
                    feedType === 'posts' ? '' : 'text-slate-500'
                  }`}
                  onClick={() => setFeedType('posts')}
                >
                  Posts
                  {feedType === 'posts' && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer ${
                    feedType === 'likes' ? '' : 'text-slate-500'
                  }`}
                  onClick={() => setFeedType('likes')}
                >
                  Likes
                  {feedType === 'likes' && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}

          {!isLoading && !isRefetching && <Posts feedType={feedType} />}
        </div>
      </div>
    </feedTypeContext.Provider>
  )
}
export default ProfilePage
