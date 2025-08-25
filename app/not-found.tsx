import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <FileQuestion className="h-8 w-8 text-gray-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Page Not Found</CardTitle>
          <CardDescription className="text-center">
            The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Sorry, we couldn't find the page you were looking for. It might have been moved, deleted, or you entered the wrong URL.
          </div>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Go home</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
