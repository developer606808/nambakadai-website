"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "buyer" | "seller" | "admin"
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: "buyer" | "seller") => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to authenticate
      // Mock login for demo purposes
      if (email && password) {
        // Mock user data
        const mockUser: User = {
          id: "user-123",
          name: email.split("@")[0],
          email,
          role: email.includes("seller") ? "seller" : "buyer",
          avatar: "/placeholder.svg?height=100&width=100",
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))

        // Redirect based on role
        if (mockUser.role === "seller") {
          router.push("/seller/dashboard")
        } else {
          router.push("/")
        }
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: "buyer" | "seller") => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to register
      // Mock signup for demo purposes
      if (name && email && password) {
        // Mock user data
        const mockUser: User = {
          id: "user-" + Math.floor(Math.random() * 1000),
          name,
          email,
          role,
          avatar: "/placeholder.svg?height=100&width=100",
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))

        // Redirect based on role
        if (role === "seller") {
          router.push("/seller/dashboard")
        } else {
          router.push("/")
        }
      } else {
        throw new Error("Invalid registration data")
      }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
