import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Notifications functionality is under development.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}