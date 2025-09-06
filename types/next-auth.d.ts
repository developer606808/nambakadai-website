import NextAuth from "next-auth"
import { Store } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: "BUYER" | "SELLER" | "ADMIN"
      isVerified: boolean
      hasStore: boolean
      currentStore?: Store | null
      stores: Store[]
    }
  }

  interface User {
    id: string
    role: "BUYER" | "SELLER" | "ADMIN"
    isVerified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "BUYER" | "SELLER" | "ADMIN"
    isVerified: boolean
  }
}
