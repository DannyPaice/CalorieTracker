import { redirect } from "next/navigation";
import { getOrCreateProfile } from "@/lib/profile";
import { ProfileForm } from "./ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/");

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your stats and calorie baseline.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Physical stats</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initial={{
              heightCm: profile.heightCm,
              currentWeightKg: profile.currentWeightKg,
              bodyFatPct: profile.bodyFatPct,
              tdeeBase: profile.tdeeBase,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}