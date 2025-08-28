import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/data/prisma"
import bcrypt from "bcryptjs"
import { User } from "@prisma/client"
import { checkUserStore } from "./store-check"
import { loginSchema } from "@/lib/validations/auth"
import { logSuccessfulLogin, logFailedLogin } from "@/lib/services/loginLogService"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        deviceToken: { label: "Device Token", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Validate credentials format
          const validatedCredentials = loginSchema.parse({
            email: credentials.email,
            password: credentials.password,
            deviceToken: credentials.deviceToken,
          })

          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email }
          })

          if (!user) {
            // Log failed login attempt
            await logFailedLogin(validatedCredentials.email, req as any, 'User not found')
            return null
          }

          // Check if user is blocked
          if (user.isBlocked) {
            await logFailedLogin(validatedCredentials.email, req as any, 'User account is blocked')
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          )

          if (!isPasswordValid) {
            await logFailedLogin(validatedCredentials.email, req as any, 'Invalid password')
            return null
          }

          // Check if email is verified
          if (!user.isVerified) {
            await logFailedLogin(validatedCredentials.email, req as any, 'Email not verified')
            // Return special error for unverified email
            throw new Error('EMAIL_NOT_VERIFIED')
          }

          // Log successful login
          await logSuccessfulLogin(user.id, req as any, validatedCredentials.deviceToken)

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
          }
        } catch (error) {
          console.error("Authentication error:", error)

          // Re-throw email verification error to handle in frontend
          if (error instanceof Error && error.message === 'EMAIL_NOT_VERIFIED') {
            throw error
          }

          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as User).role
        token.isVerified = (user as User).isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "BUYER" | "SELLER" | "ADMIN"
        session.user.isVerified = token.isVerified as boolean

        // Check user's store status
        const storeInfo = await checkUserStore(token.id as string)
        session.user.hasStore = storeInfo.hasStore
        session.user.currentStore = storeInfo.currentStore
        session.user.stores = storeInfo.stores
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)