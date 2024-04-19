export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/logout',
    '/profile/:path*',
    '/bookings/:path*',
    '/admin/:path*',
    '/bookmarks',
  ],
}
