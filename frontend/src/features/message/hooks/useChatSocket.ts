import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../services/socket'

import useGetUser from '../../../hooks/useGetUser'

const useChatSocket = () => {
  const { data: authUser } = useGetUser()

  useEffect(() => {
    if (authUser?._id) {
      connectSocket(authUser._id)
    }

    return () => disconnectSocket()
  }, [authUser?._id])
}

export default useChatSocket
