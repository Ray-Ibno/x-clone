const fetchData = async <T>(url: string, token?: string, options: RequestInit = {}): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers, // merges route-specific overrides
  }

  const response = await fetch(url, { ...headers, ...options })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`${errorData.message || response.statusText}`)
  }

  const data = await response.json()
  return data as Promise<T>
}

export default fetchData
