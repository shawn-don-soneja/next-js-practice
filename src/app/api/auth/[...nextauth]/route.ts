import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const allowedUsers = (process.env.ALLOWED_USERS ?? "")
  .split(",")
  .map((u) => u.split(":"))
  .filter(([user, pass]) => user && pass);

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
          return { id: username, name: username };
        }
        console.log('no allowed users found');
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { id: token.id, name: token.name };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
