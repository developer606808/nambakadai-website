import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/lib/store"

interface User {
  id: string
  name: string
  email: string
  role: "buyer" | "seller" | "admin"
  avatar?: string
  verified?: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Check if we're in a browser environment before accessing localStorage
const isBrowser = typeof window !== "undefined"

// Load user from localStorage on initialization if available
if (isBrowser) {
  try {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      initialState.user = JSON.parse(storedUser)
      initialState.isAuthenticated = true
    }
  } catch (error) {
    console.error("Error loading user from localStorage:", error)
  }
}

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Mock user data
      const user: User = {
        id: "user-123",
        name: email.split("@")[0],
        email,
        role: email.includes("seller") ? "seller" : "buyer",
        avatar: "/placeholder.svg?height=100&width=100",
      }

      // Store in localStorage
      if (isBrowser) {
        localStorage.setItem("user", JSON.stringify(user))
      }

      return user
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    { name, email, password, role }: { name: string; email: string; password: string; role: "buyer" | "seller" },
    { rejectWithValue },
  ) => {
    try {
      // In a real app, this would be an API call
      if (!name || !email || !password) {
        throw new Error("All fields are required")
      }

      // Mock user data
      const user: User = {
        id: "user-" + Math.floor(Math.random() * 1000),
        name,
        email,
        role,
        avatar: "/placeholder.svg?height=100&width=100",
      }

      // Store in localStorage
      if (isBrowser) {
        localStorage.setItem("user", JSON.stringify(user))
      }

      return user
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // Remove from localStorage
  if (isBrowser) {
    localStorage.removeItem("user")
  }
  return null
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload as string
    })

    // Signup
    builder.addCase(signupUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
    })
    builder.addCase(signupUser.rejected, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload as string
    })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false
      state.user = null
      state.error = null
    })
  },
})

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error

export const { clearError } = authSlice.actions
export default authSlice.reducer
