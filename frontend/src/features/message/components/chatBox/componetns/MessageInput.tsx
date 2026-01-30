import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useChatActions, useChatStore } from '../../../store/useChatStore'
import { BiSend, BiX } from 'react-icons/bi'
import { IoImage } from 'react-icons/io5'
import toast from 'react-hot-toast'

const MessageInput = () => {
  const [text, setText] = useState('')
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { selectedUser } = useChatStore()
  const { sendMessage } = useChatActions()

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const selectedFile = files[0]

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImgPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim() && !imgPreview) return

    try {
      if (selectedUser) {
        sendMessage(selectedUser._id, { text, image: imgPreview })
      }
      setText('')
      setImgPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error('Something went wrong')
      }
    }
  }

  const handleRemoveImg = () => {
    setImgPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="mt-auto p-4 w-full">
      {imgPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imgPreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={handleRemoveImg}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <BiX className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm lg:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImgChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imgPreview ? 'text-emerald-500' : 'text-zinc-400'
            }}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <IoImage size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imgPreview}
        >
          <BiSend size={22} />
        </button>
      </form>
    </div>
  )
}
export default MessageInput
