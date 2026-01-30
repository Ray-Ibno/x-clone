import Post from './Post'
import PostSkeleton from '../skeletons/PostSkeleton'

import type { POST } from '../../types/post-model'

import useGetPosts from '../../hooks/useGetPosts'

const Posts = () => {
  const { data: POSTS, isLoading, isRefetching } = useGetPosts()

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
