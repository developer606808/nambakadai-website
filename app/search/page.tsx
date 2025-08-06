import SearchPageClient from "./page.client"

export const metadata = {
  title: "Search Results | Nanbakadai Farm Marketplace",
  description: "Search results for products, stores, and rentals on Nanbakadai Farm Marketplace.",
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string; city?: string } }) {
  return <SearchPageClient searchParams={searchParams} />
}
