import axios from 'axios'

// Use the actual API server URL
const instance = axios.create({
  baseURL: 'http://localhost:8000'
})

// Set token on application start if available
const token = localStorage.getItem('authToken')
if (token) {
  instance.defaults.headers.common['Authorization'] = `Token ${token}`
}

export default instance