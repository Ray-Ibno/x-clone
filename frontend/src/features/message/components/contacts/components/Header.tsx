import { BsGear } from 'react-icons/bs'

const Header = () => {
  return (
    <header>
      <div className="flex justify-between items-center py-2 h-16">
        <h1 className="text-xl font-bold">Chat</h1>
        <BsGear />
      </div>
    </header>
  )
}
export default Header
