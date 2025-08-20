
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminLoginForm } from '@/components/auth/admin-login-form';

export default async function AdminRootPage() {
  const session = await getServerSession(authOptions);

  // If the user is already logged in and is an admin, redirect to the dashboard.
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  // Otherwise, show the login form.
  return <AdminLoginForm />;
}
