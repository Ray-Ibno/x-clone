import Post from './Post'
import PostSkeleton from '../skeletons/PostSkeleton'
import { useEffect } from 'react'

import type { POST } from '../../types/post-model'

import useGetUser from '../../hooks/useGetUser'
import useGetPosts from '../../hooks/useGetPosts'

type PostProp = {
  feedType: string
}

const Posts = ({ feedType }: PostProp) => {
  const { data: authUser } = useGetUser()

  const {
    data: POSTS,
    isLoading,
    refetch,
    isRefetching,
  } = useGetPosts(feedType, authUser._id)

  useEffect(() => {
    refetch()
  }, [feedType])

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && POSTS && (
        <div>
          {POSTS.map((post: POST) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  )
}
export default Posts
