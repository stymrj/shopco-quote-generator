import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

const fallbackImage = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520">
      <rect width="420" height="520" rx="34" fill="#f1f5f9"/>
      <path d="M128 128l54-42h56l54 42 54-2 34 82-58 25-29-55v214c0 24-18 42-42 42h-82c-24 0-42-18-42-42V178l-29 55-58-25 34-82 54 2z" fill="#111827"/>
      <path d="M183 88c9 22 44 22 54 0" fill="none" stroke="#f8fafc" stroke-width="18" stroke-linecap="round"/>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const apiRequest = async (config) => {
  try {
    const response = await apiClient(config)
    return response.data
  } catch (error) {
    if (error.response?.data) {
      return error.response.data
    }

    return {
      success: false,
      error: error.message || 'API request failed',
    }
  }
}

export const getImageUrl = (image) => {
  if (!image) return fallbackImage()
  if (image.startsWith('http')) return image
  if (image.startsWith('/api')) return API_URL.replace('/api', '') + image
  return image
}

export const signupUser = async (userData) => {
  return apiRequest({
    url: '/signup',
    method: 'POST',
    data: userData,
  })
}

export const loginUser = async (userData) => {
  return apiRequest({
    url: '/login',
    method: 'POST',
    data: userData,
  })
}

export const getLoggedInUser = async () => {
  return apiRequest({ url: '/me' })
}

export const logoutUser = async () => {
  return apiRequest({
    url: '/logout',
    method: 'POST',
  })
}

export const getProducts = async (type = 'All') => {
  return apiRequest({
    url: '/products',
    params: type && type !== 'All' ? { type } : {},
  })
}

export const getProductTypes = async () => {
  return apiRequest({ url: '/products/types' })
}

export const getProductById = async (id) => {
  return apiRequest({ url: `/products/${id}` })
}

export const createQuote = async (quoteData) => {
  return apiRequest({
    url: '/quotes',
    method: 'POST',
    data: quoteData,
  })
}

export const getQuotes = async () => {
  return apiRequest({ url: '/quotes' })
}

export const getQuoteById = async (id) => {
  return apiRequest({ url: `/quotes/${id}` })
}
