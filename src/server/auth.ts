import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./db"
import { GetServerSidePropsContext } from "next"
import { getServerSession, NextAuthOptions } from "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
const { NEXTAUTH_SECRET } = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET)
  throw new Error("Missing or invalid keys for Google")

if (!NEXTAUTH_SECRET) throw new Error("Missing or invalid Next Auth secret")

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  // Include user.id in session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
