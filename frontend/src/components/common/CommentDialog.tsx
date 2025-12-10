import { useState } from 'react'
import type { POST } from '../../types/post-model'
import Comment from './Comment'
import useCreateComment from '../../hooks/useCreateComment'
import LoadingSpinner from './LoadingSpinner'

type CommentDialogProps = {
  _id: string
  comments: POST['comments']
}

const CommentDialog = ({ post }: { post: CommentDialogProps }) => {
  const [comment, setComment] = useState('')
  const { mutate: postComment, isPending: isCommenting } = useCreateComment(
    post._id,
    comment,
    () => setComment('')
  )

  const handlePostComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isCommenting) return //prevents handlePostCommetn from running while isCommenting is true
    postComment()
  }

  return (
    <dialog
      id={`comments_modal${post._id}`}
      className="modal border-none outline-none"
    >
      <div className="modal-box rounded border border-gray-600">
        <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
        <div className="flex flex-col gap-3 max-h-60 overflow-auto">
          {post.comments.length === 0 && (
            <p className="text-sm text-slate-500">
              No comments yet 🤔 Be the first one 😉
            </p>
          )}
          {post.comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
        <form
          className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
          onSubmit={handlePostComment}
        >
          <textarea
            className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isCommenting ? <LoadingSpinner size="md" /> : 'Post'}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none">close</button>
      </form>
    </dialog>
  )
}
export default CommentDialog
