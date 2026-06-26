import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

const DEFAULT_DAY_TYPES = [
  {
    name: "Training",
    targetCalories: 2700,
    targetProteinG: 180,
    targetCarbsG: 330,
    targetFatG: 75,
  },
  {
    name: "Volleyball",
    targetCalories: 2500,
    targetProteinG: 170,
    targetCarbsG: 290,
    targetFatG: 75,
  },
  {
    name: "Rest",
    targetCalories: 2200,
    targetProteinG: 165,
    targetCarbsG: 230,
    targetFatG: 70,
  },
];

export async function getOrCreateProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  // Check if profile already exists before upserting,
  // so we know whether to seed day types
  const existing = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
  });

  if (existing) return existing;

  // Brand new user — create profile and seed day types
  // in a single transaction so they succeed or fail together
  const profile = await prisma.$transaction(async (tx) => {
    const newProfile = await tx.profile.create({
      data: { clerkUserId: userId },
    });

    await tx.dayType.createMany({
      data: DEFAULT_DAY_TYPES.map((dt) => ({
        ...dt,
        profileId: newProfile.id,
      })),
    });

    return newProfile;
  });

  return profile;
}