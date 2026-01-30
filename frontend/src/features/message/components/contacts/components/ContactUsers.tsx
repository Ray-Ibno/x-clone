import { useChatStore } from '../../../store/useChatStore'

import ContactUser from './ContactUser'

const ContactUsers = () => {
  const { chats } = useChatStore()

  return (
    <div className="overflow-y-auto w-full py-3">
      {chats?.map((chat) => (
        <ContactUser chat={chat} key={chat._id} />
      ))}
    </div>
  )
}
export default ContactUsers
