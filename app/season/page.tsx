import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/main-layout"

export default function SeasonalCalendarPage() {
  const seasons = [
    { name: "Chithirai", crops: 15 },
    { name: "Vaikasi", crops: 22 },
    { name: "Aani", crops: 18 },
    { name: "Aadi", crops: 12 },
    { name: "Aavani", crops: 20 },
    { name: "Purattasi", crops: 25 },
    { name: "Aippasi", crops: 30 },
    { name: "Karthigai", crops: 28 },
    { name: "Margazhi", crops: 15 },
    { name: "Thai", crops: 10 },
    { name: "Maasi", crops: 12 },
    { name: "Panguni", crops: 14 },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Seasonal Calendar</h1>
            <p className="text-gray-600">Organic Farming - Total Crops: 221</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Input type="text" placeholder="Search seasons..." className="pr-10 w-full md:w-[300px]" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {seasons.map((season) => (
            <Link href={`/season/${season.name.toLowerCase()}`} key={season.name}>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{season.name}</h2>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1 text-green-500"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Total Crops: {season.crops}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
