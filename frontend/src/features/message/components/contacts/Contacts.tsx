import { useEffect } from 'react'
import { useChatActions, useChatStore } from '../../store/useChatStore'
import ContactUsers from './components/ContactUsers'
import FilterBtns from './components/FilterBtns'
import Header from './components/Header'
import ContactSkeleton from './skeletons/ContactSkeleton'
import { useParams } from 'react-router-dom'

const Contacts = () => {
  const { isChatLoading, userFromProfilePage, selectedUser } = useChatStore()
  const { getUserFromProfilePage, setSelectedUser, getChats } = useChatActions()

  const { id } = useParams()

  useEffect(() => {
    getChats()

    if (userFromProfilePage) {
      setSelectedUser(userFromProfilePage)
    }
  }, [getChats, setSelectedUser, userFromProfilePage])

  useEffect(() => {
    if (id) {
      getUserFromProfilePage(id)
    }
  }, [id, getUserFromProfilePage])

  if (isChatLoading) return <ContactSkeleton />

  return (
    <div
      className={`${
        selectedUser ? 'hidden' : 'flex'
      } lg:flex flex-col h-full w-full lg:w-auto lg:min-w-[350px] border-r border-gray-700 px-4`}
    >
      <Header />
      <FilterBtns />
      <ContactUsers />
    </div>
  )
}
export default Contacts
