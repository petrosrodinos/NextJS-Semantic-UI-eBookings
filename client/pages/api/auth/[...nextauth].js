import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 3600,
  },
  callbacks: {},
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        return {
          name: { ...credentials },
        };
      },
    }),
  ],
});
