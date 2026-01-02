import { Link } from 'react-router-dom'
import { useState } from 'react'

import XSvg from '../../../components/svgs/X'

import { MdOutlineMail } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { MdPassword } from 'react-icons/md'
import { MdDriveFileRenameOutline } from 'react-icons/md'

import { useSignup } from '../../../features/auth'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
    passwordRepeat: '',
  })

  const { mutate: signup, isError, isPending, error } = useSignup(formData)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signup()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const inputElementDetails = [
    {
      icon: <MdOutlineMail />,
      type: 'email',
      placeholder: 'Email',
      name: 'email',
      value: formData.email,
    },
    {
      icon: <FaUser />,
      type: 'text',
      placeholder: 'Username',
      name: 'username',
      value: formData.username,
    },
    {
      icon: <MdDriveFileRenameOutline />,
      type: 'text',
      placeholder: 'Full Name',
      name: 'fullName',
      value: formData.fullName,
    },
    {
      icon: <MdPassword />,
      type: 'password',
      placeholder: 'Password',
      name: 'password',
      value: formData.password,
    },
    {
      icon: <MdPassword />,
      type: 'password',
      placeholder: 'Re-Type Password',
      name: 'passwordRepeat',
      value: formData.passwordRepeat,
    },
  ]

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="w-full mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          {inputElementDetails.map((input) => (
            <label
              key={input.name}
              className="input input-bordered rounded flex items-center gap-2 w-full"
            >
              {input.icon}
              <input
                type={input.type}
                className="grow"
                placeholder={input.placeholder}
                name={input.name}
                onChange={handleInputChange}
                value={input.value}
              />
            </label>
          ))}

          <button className="btn rounded-full btn-primary text-white text-xs">
            {isPending ? 'Loading...' : 'Sign up'}
          </button>
          {isError && <p className="text-red-500 text-sm">{error.message}</p>}
        </form>
        <div className="flex flex-col w-full gap-2 mt-4">
          <p className="text-white text-sm">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white text-xs btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default SignUpPage
