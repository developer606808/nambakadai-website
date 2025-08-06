import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBasket,
  Users,
  Store,
  Car,
  Tag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart,
  Activity,
  AlertCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard | Farm Marketplace",
  description: "Admin dashboard for Farm Marketplace",
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Last updated: May 23, 2025, 9:55 PM</span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Ads Count */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
                  <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +12.5%
                    </span>
                    <span className="text-[0.7rem]">from last month</span>
                  </p>
                </CardContent>
              </Card>

              {/* Category Count */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +4.2%
                    </span>
                    <span className="text-[0.7rem]">from last month</span>
                  </p>
                </CardContent>
              </Card>

              {/* User Count */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,427</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +18.2%
                    </span>
                    <span className="text-[0.7rem]">from last month</span>
                  </p>
                </CardContent>
              </Card>

              {/* Store Count */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stores</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">842</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +7.4%
                    </span>
                    <span className="text-[0.7rem]">from last month</span>
                  </p>
                </CardContent>
              </Card>

              {/* Rental Count */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rental Vehicles</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">356</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-rose-500 flex items-center">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      -2.5%
                    </span>
                    <span className="text-[0.7rem]">from last month</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[240px] flex items-center justify-center bg-muted/20 rounded-md">
                    <BarChart className="h-16 w-16 text-muted" />
                    <span className="ml-2 text-muted-foreground">Activity Chart</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="mr-2 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">New store registered</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥1,245,890</div>
                  <div className="flex items-center pt-1">
                    <span className="text-emerald-500 text-xs flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +14.2%
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">from last month</span>
                  </div>
                  <div className="mt-4 h-[60px] flex items-center justify-center bg-muted/20 rounded-md">
                    <DollarSign className="h-8 w-8 text-muted" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>New Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+248</div>
                  <div className="flex items-center pt-1">
                    <span className="text-emerald-500 text-xs flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +32.5%
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">from last month</span>
                  </div>
                  <div className="mt-4 h-[60px] flex items-center justify-center bg-muted/20 rounded-md">
                    <Users className="h-8 w-8 text-muted" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Active Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,024</div>
                  <div className="flex items-center pt-1">
                    <span className="text-emerald-500 text-xs flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +8.7%
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">from last month</span>
                  </div>
                  <div className="mt-4 h-[60px] flex items-center justify-center bg-muted/20 rounded-md">
                    <ShoppingBasket className="h-8 w-8 text-muted" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center">
              <BarChart className="h-16 w-16 mx-auto text-muted" />
              <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                Detailed analytics and reporting will be displayed here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto text-muted" />
              <h3 className="mt-4 text-lg font-medium">Reports Dashboard</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                Detailed reports and exports will be available here.
              </p>
            </div>
          </TabsContent>

          <TabsContent
            value="notifications"
            className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md"
          >
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-muted" />
              <h3 className="mt-4 text-lg font-medium">Notifications Center</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                System notifications and alerts will be displayed here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
