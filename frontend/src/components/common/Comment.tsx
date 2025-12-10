type CommentProp = {
  _id: string
  user: {
    profileImg: string
    fullName: string
    username: string
  }
  text: string
}

const Comment = ({ comment }: { comment: CommentProp }) => {
  return (
    <div className="flex gap-2 items-start">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={comment.user.profileImg || '/avatar-placeholder.png'} />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-bold">{comment.user.fullName}</span>
          <span className="text-gray-700 text-sm">
            @{comment.user.username}
          </span>
        </div>
        <div className="text-sm">{comment.text}</div>
      </div>
    </div>
  )
}
export default Comment
