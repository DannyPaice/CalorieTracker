import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24">
      <header className="space-y-2">
        <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </header>
      <Card>
        <CardHeader>
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
          ))}
          <div className="h-12 w-full bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    </main>
  );
}