import { create } from 'zustand'

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const persistUser = (user) => {
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('auth_user')
  }
}

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (!username || !password) {
        throw new Error('Username and password are required')
      }
      const user = {
        id: crypto.randomUUID(),
        username,
        email: `${username}@example.com`,
        careerDirection: '',
        avatar: '',
        createdAt: new Date().toISOString(),
      }
      persistUser(user)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  register: async (username, email, password, careerDirection) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (!username || !email || !password) {
        throw new Error('Username, email, and password are required')
      }
      const user = {
        id: crypto.randomUUID(),
        username,
        email,
        careerDirection: careerDirection || '',
        avatar: '',
        createdAt: new Date().toISOString(),
      }
      persistUser(user)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  logout: () => {
    persistUser(null)
    set({ user: null, isAuthenticated: false, error: null })
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const currentUser = useAuthStore.getState().user
      if (!currentUser) {
        throw new Error('Not authenticated')
      }
      const updatedUser = { ...currentUser, ...data }
      persistUser(updatedUser)
      set({ user: updatedUser, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))

export default useAuthStore
