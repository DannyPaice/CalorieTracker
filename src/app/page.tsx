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

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
      <div className="space-y-1 text-sm font-mono text-gray-600">
        <p>Profile ID: {profile.id}</p>
        <p>Clerk User ID: {profile.clerkUserId}</p>
        <p>Created: {profile.createdAt.toLocaleString()}</p>
      </div>
    </main>
  );
}