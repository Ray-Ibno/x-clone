import { useState } from 'react'
import { useParams } from 'react-router-dom'

import Posts from '../../components/common/Posts'
import UserProfileTopBar from '../../features/profile/components/userProfileTopBar'
import ProfileHeaderSkeleton from '../../components/skeletons/ProfileHeaderSkeleton'
import EditProfileModal from './EditProfileModal'

import { IoCalendarOutline } from 'react-icons/io5'
import { FaLink } from 'react-icons/fa'

import { feedTypeContext } from '../../context/feedTypeContext'

import useGetUser from '../../hooks/useGetUser'
import useFollow from '../../hooks/useFollow'
import useUpdateProfile from '../../features/profile/hooks/useUpdateProfile'
import useGetUserProfile from '../../features/profile/hooks/useGetUserProfile'

import { formatMemberSinceDate } from '../../utils/date'
import Button from '../../components/ui/Button'
import UserProfileImages from '../../features/profile/components/UserProfileImages'

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState<string | ArrayBuffer | null>(null)
  const [profileImg, setProfileImg] = useState<string | ArrayBuffer | null>(
    null
  )
  const [feedType, setFeedType] = useState('posts')

  const { data: authUser } = useGetUser()
  const { username } = useParams()

  const {
    data: userProfile,
    isLoading,
    isRefetching,
  } = useGetUserProfile(username)

  const { mutate: follow, isPending } = useFollow(userProfile?._id)
  const { mutate: updateImage, isPending: isUpdating } = useUpdateProfile({
    coverImg,
    profileImg,
  })

  const memberSinceDate = userProfile
    ? formatMemberSinceDate(userProfile.createdAt)
    : ''

  const isMyProfile = authUser?._id === userProfile?._id
  const isUserFollowedByMe = authUser.following.includes(userProfile?._id)

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
              <UserProfileTopBar userProfile={userProfile} />
              <UserProfileImages
                userProfile={userProfile}
                isMyProfile={isMyProfile}
                imgs={{ coverImg, profileImg }}
                setCoverImg={setCoverImg}
                setProfileImg={setProfileImg}
              />

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
