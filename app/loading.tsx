import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <p className="text-sm text-muted-foreground text-center">Loading your wellness space...</p>
        </CardContent>
      </Card>
    </div>
  )
}
