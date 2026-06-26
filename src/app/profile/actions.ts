"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ProfileSchema = z.object({
  heightCm: z.coerce
    .number()
    .min(100, "Height seems too low")
    .max(250, "Height seems too high"),
  currentWeightKg: z.coerce
    .number()
    .min(30, "Weight seems too low")
    .max(300, "Weight seems too high"),
  bodyFatPct: z.coerce
    .number()
    .min(3, "Body fat % seems too low")
    .max(60, "Body fat % seems too high")
    .optional(),
  tdeeBase: z.coerce
    .number()
    .int("TDEE must be a whole number")
    .min(1000, "TDEE seems too low")
    .max(6000, "TDEE seems too high"),
});

export type ProfileFormState = {
  errors?: {
    heightCm?: string[];
    currentWeightKg?: string[];
    bodyFatPct?: string[];
    tdeeBase?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const { userId } = await auth();
  if (!userId) {
    return { errors: { _form: ["You must be signed in"] } };
  }

  const raw = {
    heightCm: formData.get("heightCm"),
    currentWeightKg: formData.get("currentWeightKg"),
    bodyFatPct: formData.get("bodyFatPct") || undefined,
    tdeeBase: formData.get("tdeeBase"),
  };

  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.profile.update({
    where: { clerkUserId: userId },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/profile");
  redirect("/");
}