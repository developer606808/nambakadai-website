import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/data/prisma"
import bcrypt from "bcryptjs"
import { User } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            avatar: user.avatar,
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
        token.role = (user as any).role
        token.isVerified = (user as any).isVerified
        token.avatar = (user as any).avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "BUYER" | "SELLER" | "ADMIN"
        session.user.isVerified = token.isVerified as boolean
        ;(session.user as any).avatar = token.avatar as string

        // Check user's store status
        const storeInfo = await checkUserStore(token.id as string)
        session.user.hasStore = storeInfo.hasStore
        session.user.currentStore = storeInfo.currentStore
        session.user.stores = storeInfo.stores
        ;(session.user as any).storeId = storeInfo.storeId // Add storeId for backward compatibility
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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }