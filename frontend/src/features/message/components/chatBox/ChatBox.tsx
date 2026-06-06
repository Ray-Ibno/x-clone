import { useChatActions, useChatStore } from '../../store/useChatStore'
import { useEffect } from 'react'
import Header from './componetns/Header'
import ChatInfo from './componetns/ChatInfo'
import MessageInput from './componetns/MessageInput'
import Conversation from './componetns/Conversation'
import useAuth from '../../../auth/hooks/useAuth'

const ChatBox = () => {
  const { selectedUser } = useChatStore()
  const { getMessages } = useChatActions()
  const { accessToken } = useAuth()

  useEffect(() => {
    if (selectedUser && accessToken) {
      getMessages(selectedUser._id, accessToken)
    }
  }, [selectedUser, getMessages, accessToken])

  if (selectedUser) {
    return (
      <div
        className={`h-full w-full ${
          selectedUser ? 'flex' : 'hidden'
        } lg:flex flex-col items-center grow gap-6 `}
      >
        <Header />
        <ChatInfo />
        <Conversation />
        <MessageInput />
      </div>
    )
  }
}
export default ChatBox
