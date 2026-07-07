import Link from "next/link";
import { getOrCreateProfile, getTodaysDayLog } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { DayTypePicker } from "./today/DayTypePicker";
import { FoodEntryForm } from "./today/FoodEntryForm";
import { FoodEntryList } from "./today/FoodEntryList";
import { TotalsBar } from "./today/TotalsBar";

export default async function Home() {
  const profile = await getOrCreateProfile();

  if (!profile) {
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Calorie Tracker</h1>
        <p className="text-gray-600">Sign in to start tracking.</p>
      </main>
    );
  }

  const profileComplete =
    profile.heightCm !== null &&
    profile.currentWeightKg !== null &&
    profile.tdeeBase !== null;

  if (!profileComplete) {
    return (
      <main className="p-8 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <div className="border border-amber-300 bg-amber-50 rounded p-4 text-sm flex items-center justify-between">
          <span>Set up your profile to unlock daily targets.</span>
          <Link
            href="/profile"
            className="bg-amber-900 text-white px-3 py-1.5 rounded text-xs font-medium"
          >
            Set up
          </Link>
        </div>
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

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Today</h1>
        <Link
          href="/profile"
          className="text-sm text-gray-500 hover:underline"
        >
          Edit profile
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          Day type
        </h2>
        <DayTypePicker
          dayTypes={dayTypes}
          currentDayTypeId={dayLog?.dayTypeId ?? null}
        />
      </section>

      {dayLog && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Totals
          </h2>
          <TotalsBar
            consumed={consumed}
            targets={{
              targetCalories: dayLog.dayType.targetCalories,
              targetProteinG: dayLog.dayType.targetProteinG,
              targetCarbsG: dayLog.dayType.targetCarbsG,
              targetFatG: dayLog.dayType.targetFatG,
            }}
          />
        </section>
      )}

      {dayLog && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Add food
          </h2>
          <FoodEntryForm />
        </section>
      )}

      {dayLog && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Logged today
          </h2>
          <FoodEntryList entries={dayLog.foodEntries} />
        </section>
      )}
    </main>
  );
}