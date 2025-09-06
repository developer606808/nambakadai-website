import SearchPageClient from "./page.client"

export const metadata = {
  title: "Search Results | Nanbakadai Farm Marketplace",
  description: "Search results for products, stores, and rentals on Nanbakadai Farm Marketplace.",
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; city?: string }> }) {
  const params = await searchParams;
  return <SearchPageClient searchParams={params} />
}
