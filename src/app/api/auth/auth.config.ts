import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const allowedUsers = (process.env.ALLOWED_USERS ?? "")
  .split(",")
  .map((u) => u.split(":"))
  .filter(([user, pass]) => user && pass);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },      async authorize(credentials): Promise<User | null> {
        console.log('i am running! ' + JSON.stringify(credentials));
        if (!credentials){
          console.log('no credentials')
          return null; 
        }
        const { username, password } = credentials;
        if (
          allowedUsers.find(
            ([user, pass]) => user === username && pass === password
          )
        ) {
          console.log('successfully authenticated');
          // Only return the allowed properties for the User type
          return { id: username, name: username, email: username }; 
        }
        console.log('no allowed users found');
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {    async jwt({ token, user }) {
      if (user) {
        // Copy user properties to token
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};
