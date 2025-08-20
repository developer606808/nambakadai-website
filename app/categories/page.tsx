import Link from "next/link"
import { ChevronRight } from "lucide-react"
import MainLayout from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"

export const metadata = {
  title: "All Categories | Nanbakadai Farm Marketplace",
  description:
    "Browse all product and service categories on Nanbakadai Farm Marketplace. Find fresh produce, farming equipment, tools, and more.",
}

export default function CategoriesPage() {
  // Mock category data
  const categories = [
    {
      name: "Fresh Produce",
      icon: "🍎",
      subcategories: [
        { name: "Fruits", count: 124, slug: "fruits" },
        { name: "Vegetables", count: 156, slug: "vegetables" },
        { name: "Herbs", count: 78, slug: "herbs" },
        { name: "Mushrooms", count: 42, slug: "mushrooms" },
        { name: "Sprouts", count: 31, slug: "sprouts" },
      ],
    },
    {
      name: "Dairy & Eggs",
      icon: "🥚",
      subcategories: [
        { name: "Milk", count: 45, slug: "milk" },
        { name: "Cheese", count: 67, slug: "cheese" },
        { name: "Eggs", count: 38, slug: "eggs" },
        { name: "Yogurt", count: 29, slug: "yogurt" },
        { name: "Butter", count: 22, slug: "butter" },
      ],
    },
    {
      name: "Grains & Seeds",
      icon: "🌾",
      subcategories: [
        { name: "Rice", count: 56, slug: "rice" },
        { name: "Wheat", count: 43, slug: "wheat" },
        { name: "Corn", count: 38, slug: "corn" },
        { name: "Seeds", count: 72, slug: "seeds" },
        { name: "Beans", count: 51, slug: "beans" },
      ],
    },
    {
      name: "Meat & Poultry",
      icon: "🥩",
      subcategories: [
        { name: "Beef", count: 47, slug: "beef" },
        { name: "Pork", count: 39, slug: "pork" },
        { name: "Chicken", count: 52, slug: "chicken" },
        { name: "Duck", count: 18, slug: "duck" },
        { name: "Game Meat", count: 23, slug: "game-meat" },
      ],
    },
    {
      name: "Seafood",
      icon: "🐟",
      subcategories: [
        { name: "Fish", count: 63, slug: "fish" },
        { name: "Shellfish", count: 41, slug: "shellfish" },
        { name: "Seaweed", count: 27, slug: "seaweed" },
      ],
    },
    {
      name: "Processed Foods",
      icon: "🥫",
      subcategories: [
        { name: "Jams & Preserves", count: 34, slug: "jams-preserves" },
        { name: "Pickles", count: 28, slug: "pickles" },
        { name: "Sauces", count: 42, slug: "sauces" },
        { name: "Dried Foods", count: 37, slug: "dried-foods" },
      ],
    },
    {
      name: "Beverages",
      icon: "🍹",
      subcategories: [
        { name: "Juices", count: 45, slug: "juices" },
        { name: "Teas", count: 53, slug: "teas" },
        { name: "Coffee", count: 38, slug: "coffee" },
        { name: "Alcoholic Beverages", count: 67, slug: "alcoholic-beverages" },
      ],
    },
    {
      name: "Honey & Sweeteners",
      icon: "🍯",
      subcategories: [
        { name: "Honey", count: 42, slug: "honey" },
        { name: "Maple Syrup", count: 18, slug: "maple-syrup" },
        { name: "Sugar", count: 24, slug: "sugar" },
      ],
    },
    {
      name: "Plants & Seeds",
      icon: "🌱",
      subcategories: [
        { name: "Seedlings", count: 87, slug: "seedlings" },
        { name: "Seeds for Planting", count: 112, slug: "seeds-for-planting" },
        { name: "Flowers", count: 76, slug: "flowers" },
        { name: "Trees", count: 43, slug: "trees" },
      ],
    },
    {
      name: "Farm Equipment",
      icon: "🚜",
      subcategories: [
        { name: "Tractors", count: 24, slug: "tractors" },
        { name: "Harvesters", count: 16, slug: "harvesters" },
        { name: "Hand Tools", count: 78, slug: "hand-tools" },
        { name: "Irrigation", count: 32, slug: "irrigation" },
      ],
    },
    {
      name: "Livestock",
      icon: "🐄",
      subcategories: [
        { name: "Cattle", count: 28, slug: "cattle" },
        { name: "Poultry", count: 42, slug: "poultry" },
        { name: "Sheep & Goats", count: 31, slug: "sheep-goats" },
        { name: "Pigs", count: 19, slug: "pigs" },
      ],
    },
    {
      name: "Farm Supplies",
      icon: "🧰",
      subcategories: [
        { name: "Fertilizers", count: 53, slug: "fertilizers" },
        { name: "Pesticides", count: 41, slug: "pesticides" },
        { name: "Soil & Mulch", count: 37, slug: "soil-mulch" },
        { name: "Fencing", count: 28, slug: "fencing" },
      ],
    },
    {
      name: "Seasonal Items",
      icon: "🍂",
      subcategories: [
        { name: "Spring", count: 67, slug: "spring" },
        { name: "Summer", count: 82, slug: "summer" },
        { name: "Fall", count: 74, slug: "fall" },
        { name: "Winter", count: 58, slug: "winter" },
      ],
    },
    {
      name: "Organic Products",
      icon: "🌿",
      subcategories: [
        { name: "Organic Produce", count: 124, slug: "organic-produce" },
        { name: "Organic Dairy", count: 43, slug: "organic-dairy" },
        { name: "Organic Meat", count: 37, slug: "organic-meat" },
        { name: "Organic Seeds", count: 52, slug: "organic-seeds" },
      ],
    },
    {
      name: "Specialty Items",
      icon: "🎁",
      subcategories: [
        { name: "Gift Baskets", count: 31, slug: "gift-baskets" },
        { name: "Artisanal Products", count: 47, slug: "artisanal-products" },
        { name: "Rare Varieties", count: 28, slug: "rare-varieties" },
      ],
    },
    {
      name: "Services",
      icon: "🛠️",
      subcategories: [
        { name: "Farm Labor", count: 42, slug: "farm-labor" },
        { name: "Equipment Rental", count: 37, slug: "equipment-rental" },
        { name: "Consulting", count: 23, slug: "consulting" },
        { name: "Transportation", count: 18, slug: "transportation" },
      ],
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Categories</h1>
          <p className="text-gray-600">
            Browse all product and service categories available on Nanbakadai Farm Marketplace.
          </p>
        </div>

        <LazyLoadWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg border overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{category.icon}</span>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={`/categories/${subcategory.slug}`}
                          className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 group"
                        >
                          <span className="group-hover:text-green-600 transition-colors">{subcategory.name}</span>
                          <div className="flex items-center text-gray-500">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{subcategory.count}</span>
                            <ChevronRight className="h-4 w-4 ml-2 group-hover:text-green-600 transition-colors" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t text-center">
                    <Link
                      href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View All {category.name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LazyLoadWrapper>
      </div>
    </MainLayout>
  )
}
