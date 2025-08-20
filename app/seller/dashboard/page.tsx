import Link from "next/link"
import { Button } from "@/components/ui/button"
import SellerLayout from "@/components/seller/seller-layout"

export default function SellerDashboardPage() {
  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button className="bg-green-500 hover:bg-green-600" asChild>
          <Link href="/seller/products\
