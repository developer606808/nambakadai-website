import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analytics functionality is under development.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}