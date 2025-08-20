import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookie();

  // The middleware now handles the primary authentication check.
  // This layout handles role-based authorization for the protected admin area.
  if (!user || user.role !== 'ADMIN') {
    // This should theoretically not be hit if middleware is correct,
    // but serves as a strong second layer of defense.
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}