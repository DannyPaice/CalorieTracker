"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile, type ProfileFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  initial: {
    heightCm: number | null;
    currentWeightKg: number | null;
    bodyFatPct: number | null;
    tdeeBase: number | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export function ProfileForm({ initial }: Props) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field
        name="heightCm"
        label="Height (cm)"
        step="0.1"
        defaultValue={initial.heightCm ?? ""}
        errors={state.errors?.heightCm}
      />
      <Field
        name="currentWeightKg"
        label="Current weight (kg)"
        step="0.1"
        defaultValue={initial.currentWeightKg ?? ""}
        errors={state.errors?.currentWeightKg}
      />
      <Field
        name="bodyFatPct"
        label="Body fat % (optional)"
        step="0.1"
        defaultValue={initial.bodyFatPct ?? ""}
        errors={state.errors?.bodyFatPct}
      />
      <Field
        name="tdeeBase"
        label="TDEE baseline (kcal)"
        defaultValue={initial.tdeeBase ?? ""}
        errors={state.errors?.tdeeBase}
      />

      {state.errors?._form && (
        <p className="text-sm text-destructive">{state.errors._form[0]}</p>
      )}

      <SubmitButton />
    </form>
  );
}

function Field({
  name,
  label,
  step,
  defaultValue,
  errors,
}: {
  name: string;
  label: string;
  step?: string;
  defaultValue: string | number;
  errors?: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="number"
        step={step ?? "1"}
        inputMode="decimal"
        defaultValue={defaultValue}
      />
      {errors?.[0] && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
}