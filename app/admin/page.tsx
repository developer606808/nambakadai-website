import { redirect } from 'next/navigation';

// Simple redirect to dashboard for now
export default function AdminPage() {
  redirect('/admin/dashboard');
}