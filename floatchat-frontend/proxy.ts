import { withAuth } from "next-auth/middleware";

const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "float-chat-demo-secret-change-me";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: AUTH_SECRET,
});

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/visualization/:path*", "/upload/:path*"],
};
