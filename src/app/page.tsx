import Link from "next/link";
import { getOrCreateProfile, getTodaysDayLog } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { DayTypePicker } from "./today/DayTypePicker";
import { FoodEntryForm } from "./today/FoodEntryForm";
import { FoodEntryList } from "./today/FoodEntryList";
import { TotalsBar } from "./today/TotalsBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const profile = await getOrCreateProfile();

  if (!profile) {
    return (
      <main className="p-6 max-w-md mx-auto space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Calorie Tracker</h1>
        <p className="text-muted-foreground">Sign in to start tracking.</p>
      </main>
    );
  }

  const profileComplete =
    profile.heightCm !== null &&
    profile.currentWeightKg !== null &&
    profile.tdeeBase !== null;

  if (!profileComplete) {
    return (
      <main className="p-6 max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
        <Card>
          <CardHeader>
            <CardTitle>Set up your profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add your height, weight, and calorie baseline to unlock daily
              targets.
            </p>
            <Link href="/profile" className="block">
              <Button size="lg" className="w-full">Get started</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [dayTypes, dayLog] = await Promise.all([
    prisma.dayType.findMany({
      where: { profileId: profile.id },
      orderBy: { name: "asc" },
    }),
    getTodaysDayLog(profile.id),
  ]);

  const consumed = (dayLog?.foodEntries ?? []).reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      proteinG: acc.proteinG + entry.proteinG,
      carbsG: acc.carbsG + entry.carbsG,
      fatG: acc.fatG + entry.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  const dateLabel = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">{dateLabel}</p>
        <h1 className="text-3xl font-bold tracking-tight">Today</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Day type</CardTitle>
        </CardHeader>
        <CardContent>
          <DayTypePicker
            dayTypes={dayTypes}
            currentDayTypeId={dayLog?.dayTypeId ?? null}
          />
        </CardContent>
      </Card>

      {dayLog && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Totals</CardTitle>
          </CardHeader>
          <CardContent>
            <TotalsBar
              consumed={consumed}
              targets={{
                targetCalories: dayLog.dayType.targetCalories,
                targetProteinG: dayLog.dayType.targetProteinG,
                targetCarbsG: dayLog.dayType.targetCarbsG,
                targetFatG: dayLog.dayType.targetFatG,
              }}
            />
          </CardContent>
        </Card>
      )}

      {dayLog && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add food</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodEntryForm />
          </CardContent>
        </Card>
      )}

      {dayLog && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Logged today</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodEntryList entries={dayLog.foodEntries} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}