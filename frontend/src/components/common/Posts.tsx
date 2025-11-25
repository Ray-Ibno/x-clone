import Post from './Post'
import PostSkeleton from '../skeletons/PostSkeleton'
import useGetPosts from '../../hooks/useGetPosts'

import type { POST } from '../../types/post-model'
import { useEffect } from 'react'

type PostProp = {
  feedType: string
}

const Posts = ({ feedType }: PostProp) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case 'forYou':
        return 'all'
      case 'following':
        return 'following'
      default:
        'all'
    }
  }

  const endpoint = getPostEndpoint()

  const {
    data: POSTS,
    isLoading,
    refetch,
    isRefetching,
  } = useGetPosts(endpoint === undefined ? 'all' : endpoint)

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
