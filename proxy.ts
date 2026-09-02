import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/connexion",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
