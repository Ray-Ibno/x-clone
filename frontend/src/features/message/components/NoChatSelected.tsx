import { FaRegEnvelope } from 'react-icons/fa'

const NoChatSelected = () => {
  return (
    <div className="h-full w-full hidden lg:flex flex-col items-center justify-center grow gap-6">
      <div className="flex items-center justify-center bg-zinc-900 rounded-full size-16">
        <FaRegEnvelope size={24} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <h2 className="font-bold text-center text-s">Start Conversation</h2>
        <p className="text-zinc-500 max-w-full text-xs text-center">
          Choose from your existing conversations, or start a new one.
        </p>
      </div>
    </div>
  )
}
export default NoChatSelected
