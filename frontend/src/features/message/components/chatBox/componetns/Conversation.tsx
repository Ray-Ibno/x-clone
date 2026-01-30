import { useEffect, useRef } from 'react'
import useGetUser from '../../../../../hooks/useGetUser'
import { formatMessageTime } from '../../../../../utils/date'
import { useChatStore } from '../../../store/useChatStore'
import MessageSkeleton from '../../contacts/skeletons/MessageSkeleton'

const Conversation = () => {
  const { data: authUser } = useGetUser()
  const { messages, isMessageLoading } = useChatStore()

  const latestMessageRef = useRef<HTMLDivElement | null>(null)
  const initialMount = useRef(true) // for scrolling instantly on mount

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current?.scrollIntoView({
        behavior: `${initialMount.current ? 'instant' : 'smooth'}`,
        block: 'end',
      })
      initialMount.current = false
    }
  }, [messages])

  if (isMessageLoading) return <MessageSkeleton />

  return (
    <div className="flex flex-col w-full overflow-y-auto">
      {messages.map((message, id) => (
        <div
          ref={latestMessageRef}
          key={id}
          className={`relative my-5 py-2 px-4 mx-8 rounded-xl ${
            message.sender === authUser?._id ? 'self-end bg-sky-500' : 'self-start bg-zinc-900'
          }`}
        >
          <p
            className={`absolute -top-5 ${
              message.sender === authUser?._id ? 'right-0' : 'left-0'
            } text-xs text-zinc-600`}
          >
            {formatMessageTime(message.createdAt)}
          </p>
          {message.image && (
            <img
              src={message.image}
              alt="Chat Image"
              className="sm:max-w-[200px] rounded-md mb-2"
            />
          )}
          <p className=" font-light">{message.text}</p>
        </div>
      ))}
    </div>
  )
}
export default Conversation
