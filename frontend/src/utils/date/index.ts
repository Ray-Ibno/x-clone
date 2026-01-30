export const formatPostDate = (createdAt: string) => {
  const currentDate = new Date()
  const createdAtDate = new Date(createdAt)

  const timeDifferenceInSeconds = Math.floor(
    (currentDate.valueOf() - createdAtDate.valueOf()) / 1000
  )
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60)
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60)
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24)

  if (timeDifferenceInDays > 1) {
    return createdAtDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } else if (timeDifferenceInDays === 1) {
    return '1d'
  } else if (timeDifferenceInHours >= 1) {
    return `${timeDifferenceInHours}h`
  } else if (timeDifferenceInMinutes >= 1) {
    return `${timeDifferenceInMinutes}m`
  } else {
    return 'Just now'
  }
}

export const formatMemberSinceDate = (createdAt: string) => {
  const date = new Date(createdAt)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `Joined ${month} ${year}`
}

export const formatMessageDate = (createdAt: string) => {
  const currentDate = new Date()
  const date = new Date(createdAt)
  const timeDifferenceInSeconds = Math.floor((currentDate.valueOf() - date.valueOf()) / 1000)
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60)
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60)
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24)

  if (timeDifferenceInSeconds < 1) {
    return 'right now'
  }
  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} sec ago`
  }
  if (timeDifferenceInMinutes < 60) {
    return `${Math.floor(timeDifferenceInMinutes)} min ago`
  }
  if (timeDifferenceInHours < 24) {
    return `${Math.floor(timeDifferenceInHours)} hours ago`
  }
  if (timeDifferenceInDays < 365) {
    return `${Math.floor(timeDifferenceInDays)} ${
      Math.floor(timeDifferenceInDays) === 1 ? 'day' : 'days'
    } ago`
  }
}

export const formatMessageTime = (createdAt: string) => {
  const date = new Date(createdAt)
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return time
}
