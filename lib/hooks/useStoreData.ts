"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface StoreData {
  id?: number
  name: string
  contactName: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logo: string
  banner: string
}

export function useStoreData() {
  const { data: session, update } = useSession()
  const [storeData, setStoreData] = useState<StoreData>({
    name: "Fresh Farm Produce",
    contactName: "Rajesh Kumar", 
    description: "We sell fresh organic vegetables and fruits directly from our farm to your table.",
    address: "123 Farm Road, Village Greenfield, District Organic, State 123456",
    phone: "9876543210",
    email: "contact@freshfarm.com",
    website: "https://freshfarm.com",
    logo: "/api/placeholder/100/100",
    banner: "/api/placeholder/400/200"
  })

  // Update store data when session loads or changes
  useEffect(() => {
    if (session?.user?.currentStore) {
      const store = session.user.currentStore
      setStoreData({
        id: store.id,
        name: store.name || "Fresh Farm Produce",
        contactName: store.contactName || "Rajesh Kumar",
        description: store.description || "We sell fresh organic vegetables and fruits directly from our farm to your table.",
        address: store.address || "123 Farm Road, Village Greenfield, District Organic, State 123456",
        phone: store.phone || "9876543210",
        email: store.email || "contact@freshfarm.com",
        website: store.website || "https://freshfarm.com",
        logo: store.logo || "/api/placeholder/100/100",
        banner: store.banner || "/api/placeholder/400/200"
      })
    }
  }, [session])

  const updateStoreData = async (newData: Partial<StoreData>) => {
    try {
      // Update local state immediately
      setStoreData(prev => ({ ...prev, ...newData }))

      // Update store via API
      const response = await fetch(`/api/stores/${storeData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })

      if (!response.ok) {
        throw new Error('Failed to update store')
      }

      // Refresh session to get updated store data
      await update()

      return { success: true }
    } catch (error) {
      console.error('Error updating store:', error)
      // Revert local state on error
      if (session?.user?.currentStore) {
        const store = session.user.currentStore
        setStoreData({
          id: store.id,
          name: store.name || "Fresh Farm Produce",
          contactName: store.contactName || "Rajesh Kumar",
          description: store.description || "",
          address: store.address || "",
          phone: store.phone || "",
          email: store.email || "",
          website: store.website || "",
          logo: store.logo || "/api/placeholder/100/100",
          banner: store.banner || "/api/placeholder/400/200"
        })
      }
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  const refreshStoreData = async () => {
    await update()
  }

  return {
    storeData,
    setStoreData,
    updateStoreData,
    refreshStoreData,
    currentStore: session?.user?.currentStore,
    hasStore: session?.user?.hasStore || false
  }
}
