
import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';
import SellerLayout from '@/components/seller/seller-layout'; // Assuming a general seller layout component exists

export default async function ProtectedSellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookie();

  if (!user) {
    redirect('/login');
  }

  // If the user is not a SELLER, redirect them.
  if (user.role !== 'SELLER') {
    redirect('/unauthorized');
  }

  // You could fetch seller-specific data here to pass to the layout, e.g., store info

  return <SellerLayout>{children}</SellerLayout>;
}
