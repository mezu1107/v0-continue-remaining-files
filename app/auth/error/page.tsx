import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-7" />
          </div>
          <div>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground">AM Enterprises</h1>
            <p className="text-sm text-muted-foreground">Enterprise Admin Panel</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" />
            </div>
            <CardTitle className="text-lg">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">
                Error: {params.error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                An unspecified error occurred during authentication.
              </p>
            )}
            <Button asChild className="w-full">
              <Link href="/auth/login">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
