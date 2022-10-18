import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, _req) => {
        try {
          const { data, status } = await axios.get(
            `${process.env.APP_URL}/api/signin?email=${credentials?.email}&password=${credentials?.password}`
          );

          if (status === 200) {
            return {
              id: data.id,
              email: data.email,
              name: data.name,
              lastname: data.lastname,
            };
          }
          return null; // Add this line to satisfy the `authorize` typings
        } catch (e: any) {
          //const errorMessage = e.response.data.message;
          //throw new Error(errorMessage);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: any) {
      return token
    },
    async signIn({ user, account, profile, email, credentials }: any) {
      return true
    },
    async redirect({ url, baseUrl }: any) {
      return baseUrl
    },
    session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;

      return session; // The return type will match the one returned in `useSession()`
    }
  },

  pages: {
    signIn: "/auth/signin",
  },

};
export default NextAuth(authOptions);
