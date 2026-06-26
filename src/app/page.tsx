import Link from "next/link";
import { getOrCreateProfile } from "@/lib/profile";

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

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Welcome back</h1>

      {!profileComplete && (
        <div className="border border-amber-300 bg-amber-50 rounded p-4 text-sm flex items-center justify-between">
          <span>Set up your profile to unlock daily targets.</span>
          <Link
            href="/profile"
            className="bg-amber-900 text-white px-3 py-1.5 rounded text-xs font-medium"
          >
            Set up
          </Link>
        </div>
      )}

      {profileComplete && (
        <div className="space-y-1 text-sm">
          <p>Height: {profile.heightCm} cm</p>
          <p>Weight: {profile.currentWeightKg} kg</p>
          {profile.bodyFatPct !== null && <p>Body fat: {profile.bodyFatPct}%</p>}
          <p>TDEE baseline: {profile.tdeeBase} kcal</p>
          <Link
            href="/profile"
            className="inline-block mt-2 text-blue-600 underline text-sm"
          >
            Edit profile
          </Link>
        </div>
      )}
    </main>
  );
}