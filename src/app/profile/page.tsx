import { redirect } from "next/navigation";
import { getOrCreateProfile } from "@/lib/profile";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/");

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile setup</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Set your physical stats and calorie baseline. These power your daily
        targets.
      </p>
      <ProfileForm
        initial={{
          heightCm: profile.heightCm,
          currentWeightKg: profile.currentWeightKg,
          bodyFatPct: profile.bodyFatPct,
          tdeeBase: profile.tdeeBase,
        }}
      />
    </main>
  );
}