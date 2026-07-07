"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { todayDate } from "@/lib/date";

async function requireProfile() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
  });
  if (!profile) throw new Error("Profile not found");

  return profile;
}

/**
 * Ensure a DayLog exists for today with the given DayType.
 * Idempotent: repeated calls with the same day type are no-ops.
 * Changing the day type updates the existing row.
 */
export async function pickDayType(dayTypeId: string) {
  const profile = await requireProfile();

  await prisma.dayLog.upsert({
    where: {
      profileId_date: { profileId: profile.id, date: todayDate() },
    },
    update: { dayTypeId },
    create: {
      profileId: profile.id,
      date: todayDate(),
      dayTypeId,
    },
  });

  revalidatePath("/");
}

const FoodEntrySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  calories: z.coerce.number().int().min(0).max(10000),
  proteinG: z.coerce.number().min(0).max(500),
  carbsG: z.coerce.number().min(0).max(1000),
  fatG: z.coerce.number().min(0).max(500),
});

export type FoodEntryFormState = {
  errors?: {
    name?: string[];
    calories?: string[];
    proteinG?: string[];
    carbsG?: string[];
    fatG?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function addFoodEntry(
  _prev: FoodEntryFormState,
  formData: FormData
): Promise<FoodEntryFormState> {
  const profile = await requireProfile();

  const dayLog = await prisma.dayLog.findUnique({
    where: {
      profileId_date: { profileId: profile.id, date: todayDate() },
    },
  });
  if (!dayLog) {
    return { errors: { _form: ["Pick a day type before logging food"] } };
  }

  const parsed = FoodEntrySchema.safeParse({
    name: formData.get("name"),
    calories: formData.get("calories"),
    proteinG: formData.get("proteinG"),
    carbsG: formData.get("carbsG"),
    fatG: formData.get("fatG"),
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.foodEntry.create({
    data: {
      profileId: profile.id,
      dayLogId: dayLog.id,
      ...parsed.data,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteFoodEntry(id: string) {
  const profile = await requireProfile();

  // Verify ownership before deleting to prevent
  // one user from deleting another's rows if they know the ID
  const entry = await prisma.foodEntry.findUnique({ where: { id } });
  if (!entry || entry.profileId !== profile.id) {
    throw new Error("Not found");
  }

  await prisma.foodEntry.delete({ where: { id } });
  revalidatePath("/");
}