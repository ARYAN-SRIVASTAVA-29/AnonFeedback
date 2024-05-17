import {NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req: request})
    const url = request.nextUrl

    if(token && 
      (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')  ||
        url.pathname.startsWith('/') 
      )  
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
    ]
}


//====================================================

// import { NextRequest, NextResponse } from 'next/server'
// export { default } from 'next-auth/middleware'
// import { getToken } from 'next-auth/jwt'

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//     const token = await getToken({ req: request })
//     const url = request.nextUrl

//     // Redirect authenticated users away from sign-in, sign-up, and verify pages
//     if (token) {
//         if (
//             url.pathname.startsWith('/sign-in') ||
//             url.pathname.startsWith('/sign-up') ||
//             url.pathname.startsWith('/verify')
//         ) {
//             return NextResponse.redirect(new URL('/dashboard', request.url))
//         }
//     } else {
//         // Redirect unauthenticated users away from protected pages
//         if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/verify')) {
//             return NextResponse.redirect(new URL('/sign-in', request.url))
//         }
//     }

//     // Allow the request to proceed if none of the conditions matched
//     return NextResponse.next()
// }

// // See "Matching Paths" below to learn more
// export const config = {
//     matcher: [
//         '/sign-in',
//         '/sign-up',
//         '/',
//         '/dashboard/:path*',
//         '/verify/:path*'
//     ]
// }
