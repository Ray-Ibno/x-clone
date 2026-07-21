const safeAwait = (promise, customErrorMessage = 'Cache synchronization failed: ') =>
  promise.catch((err) => {
    console.error(customErrorMessage, err.message)
    return null
  })
