
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { findOrCreateUserFromGoogle } from "@/lib/actions/user.actions";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        const googleProfile = profile as any;
        const dbUser = await findOrCreateUserFromGoogle({
          email: googleProfile.email,
          firstName: googleProfile.given_name,
          lastName: googleProfile.family_name,
          googleId: googleProfile.sub,
          // You might want to store the avatar as well
          // avatar: googleProfile.picture, 
        });

        if (dbUser) {
          // Attach your internal user ID to the token
          user.id = dbUser._id;
          return true;
        }
      }
      // For password-based auth, or if something fails, deny sign-in
      return false; 
    },
    async jwt({ token, user }: { token: JWT, user?: AdapterUser }) {
      // After a successful sign-in, the user object is available.
      // We persist the internal user ID to the token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      // The session callback is called whenever a session is checked.
      // We assign the user ID from the token to the session object.
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
})

export { handler as GET, handler as POST }
