import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Role } from '@prisma/client';
import { prisma } from '@/server/prisma';
import { env } from '@/env/server.mjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  // Include user.id on session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
