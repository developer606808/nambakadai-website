import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookie();
  const session = await getServerSession(authOptions);

  // If no user is logged in, the middleware should have already redirected.
  // This is an extra layer of security.
  if (!user) {
    // redirect('/admin/login');
  }

  // If the user is not an ADMIN, redirect them to an unauthorized page.
  if (user && user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  // console.log('session',session);

  const hideSidebar = session && session?.user ? true : false;

  return (
    <div className="flex h-screen bg-gray-100">
      {hideSidebar && <AdminSidebar />}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}