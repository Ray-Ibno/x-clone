import { Link } from 'react-router-dom'
import { useState } from 'react'
import Button from '../ui/Button'
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton'

import LoadingSpinner from './LoadingSpinner'
import type { User } from '../../types/user-model'

import useFollow from '../../hooks/useFollow'
import useGetSuggestedUsers from '../../hooks/useGetSuggested'

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useGetSuggestedUsers()

  const [selectedSuggetedUser, setSelectedSuggestedUser] = useState('')

  const { mutate: followUser, isPending } = useFollow(selectedSuggetedUser)

  if (suggestedUsers?.length < 1) return <div className="md:w-64 w-0"></div>

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user: User) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || '/avatar-placeholder.png'} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <Button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      e.preventDefault()
                      setSelectedSuggestedUser(user._id)
                      followUser()
                    }}
                    label={isPending ? <LoadingSpinner size="sm" /> : 'Follow'}
                  />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
export default RightPanel
