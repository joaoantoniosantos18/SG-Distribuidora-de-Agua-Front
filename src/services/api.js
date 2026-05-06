import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// Interceptor que adiciona o token automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('token')
  
  // Se tiver token, adiciona no header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

export default api