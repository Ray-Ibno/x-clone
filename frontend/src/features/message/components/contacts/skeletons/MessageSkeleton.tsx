const MessageSkeleton = () => {
  const skeletonArr = Array(6).fill(null)

  return (
    <div className="flex flex-col w-full">
      {skeletonArr.map((_, id) => (
        <div key={id} className={`chat ${id % 2 === 0 ? 'chat-start' : 'chat-end'}`}>
          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-12 w-[200px] rounded-xl mx-8" />
          </div>
        </div>
      ))}
    </div>
  )
}
export default MessageSkeleton
