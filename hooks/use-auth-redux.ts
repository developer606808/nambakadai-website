"use client"

import { useSelector } from "react-redux"
import {
  selectUser,
  selectIsAuthenticated,
} from "@/lib/features/auth/authSlice"

export function useAuthRedux() {
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return {
    user,
    isAuthenticated,
  }
}