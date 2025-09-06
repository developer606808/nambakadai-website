"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import {
  loginUser,
  signupUser,
  logoutUser,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from "@/lib/features/auth/authSlice"
import type { AppDispatch } from "@/lib/store"

export function useAuthRedux() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await dispatch(loginUser({ email, password })).unwrap()

        // Redirect based on role
        if (email.includes("seller")) {
          router.push("/seller/dashboard")
        } else {
          router.push("/")
        }
        return true
      } catch (error) {
        return false
      }
    },
    [dispatch, router],
  )

  const signup = useCallback(
    async (name: string, email: string, password: string, role: "buyer" | "seller") => {
      try {
        await dispatch(signupUser({ name, email, password, role })).unwrap()

        // Redirect based on role
        if (role === "seller") {
          router.push("/seller/dashboard")
        } else {
          router.push("/")
        }
        return true
      } catch (error) {
        return false
      }
    },
    [dispatch, router],
  )

  const logout = useCallback(() => {
    dispatch(logoutUser())
    router.push("/")
  }, [dispatch, router])

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    resetError,
  }
}
