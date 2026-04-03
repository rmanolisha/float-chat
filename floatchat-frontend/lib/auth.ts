import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "float-chat-demo-secret-change-me";

export const authOptions: NextAuthOptions = {
  secret: AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          return {
            id: ADMIN_USERNAME,
            name: ADMIN_USERNAME,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.name) {
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.name) {
        session.user.name = token.name;
      }

      return session;
    },
  },
};
