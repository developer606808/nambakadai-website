import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Payments functionality is under development.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}