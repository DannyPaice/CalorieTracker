import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrCreateProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.profile.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: { clerkUserId: userId },
  });

  return profile;
}