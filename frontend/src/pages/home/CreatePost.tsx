import { CiImageOn } from 'react-icons/ci'
import { BsEmojiSmileFill } from 'react-icons/bs'
import { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

import useGet from '../../hooks/useGet'
import usePost from '../../hooks/usePost'

const CreatePost = () => {
  const [text, setText] = useState('')
  const [img, setImg] = useState<string | null | undefined>(null)
  const [file, setFile] = useState<File | null>(null)
  const imgRef = useRef<HTMLInputElement | null>(null)

  const { data: user } = useGet('authUser', '/api/auth/user')

  useEffect(() => {
    if (!file) {
      setImg(null)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      typeof reader.result === 'string' && setImg(reader.result)
    }
    reader.onerror = () => {
      console.error('Reader error')
    }
    reader.readAsDataURL(file)

    return () => {
      reader.abort()
    }
  }, [file])

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = usePost('posts', '/api/posts/create', 'Post created succefully')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isPending) {
      //Disables submit button while pending
      return
    }
    createPost({ text, img: img === undefined ? null : img })
    setImg(null)
    setText('')
  }

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (imgRef.current && imgRef.current.value) {
      imgRef.current.value = ''
    }
  }

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={user.profileImg || '/avatar-placeholder.png'} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null)
                if (imgRef.current && imgRef.current.value) {
                  imgRef.current.value = ''
                }
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current && imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  )
}
export default CreatePost
