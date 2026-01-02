const useFetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options)

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(`${errorData.message || res.statusText}`)
  }

  const data = await res.json()
  return data as Promise<T>
}

export default useFetchApi
