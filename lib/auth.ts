// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
import prisma from './prisma'; // Assuming this path is correct

// interface DecodedToken {
//   userId: number;
//   role: string;
//   iat: number;
//   exp: number;
// }

// export async function getUserFromCookie() {
//   // Await the cookies() function to get the Cookies object
//   const cookieStore = await cookies();
//   const token = cookieStore.get('token')?.value;

//   if (!token) {
//     return null;
//   }

//   try {
//     // Ensure JWT_SECRET is defined in your environment variables
//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       console.error('JWT_SECRET is not defined in environment variables.');
//       return null;
//     }

//     const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

//     // Fetch user from Prisma using the decoded userId
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       select: { id: true, name: true, email: true, role: true, image: true, emailVerified: true },
//     });

//     if (!user) {
//       return null;
//     }

//     // Return a simplified user object
//     return {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role as 'USER' | 'SELLER' | 'ADMIN', // Ensure role type is correct
//       avatar: user.image || undefined, // Use 'undefined' if image is null
//       verified: user.emailVerified ? true : false,
//     };
//   } catch (error) {
//     console.error('Failed to verify token or fetch user:', error);
//     // Invalidate the cookie if token verification fails (e.g., expired, invalid signature)
//     cookieStore.delete('token');
//     return null;
//   }
// }