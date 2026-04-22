export { default } from "next-auth/middleware"

export const config = {
    matcher: ["/admin/dashboard/:path*", "/admin/properties/:path*", "/admin/enquiries/:path*", "/admin/settings/:path*"]
}
