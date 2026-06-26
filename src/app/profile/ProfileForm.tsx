"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile, type ProfileFormState } from "./actions";

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
    <button
      type="submit"
      disabled={pending}
      className="bg-black text-white px-4 py-2 rounded font-medium disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export function ProfileForm({ initial }: Props) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    {}
  );

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <Field
        name="heightCm"
        label="Height (cm)"
        type="number"
        step="0.1"
        defaultValue={initial.heightCm ?? ""}
        errors={state.errors?.heightCm}
      />
      <Field
        name="currentWeightKg"
        label="Current weight (kg)"
        type="number"
        step="0.1"
        defaultValue={initial.currentWeightKg ?? ""}
        errors={state.errors?.currentWeightKg}
      />
      <Field
        name="bodyFatPct"
        label="Body fat % (optional)"
        type="number"
        step="0.1"
        defaultValue={initial.bodyFatPct ?? ""}
        errors={state.errors?.bodyFatPct}
      />
      <Field
        name="tdeeBase"
        label="TDEE baseline (kcal)"
        type="number"
        defaultValue={initial.tdeeBase ?? ""}
        errors={state.errors?.tdeeBase}
      />

      {state.errors?._form && (
        <p className="text-sm text-red-600">{state.errors._form[0]}</p>
      )}

      <SubmitButton />
    </form>
  );
}

function Field({
  name,
  label,
  type,
  step,
  defaultValue,
  errors,
}: {
  name: string;
  label: string;
  type: string;
  step?: string;
  defaultValue: string | number;
  errors?: string[];
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      {errors?.[0] && <p className="text-sm text-red-600">{errors[0]}</p>}
    </div>
  );
}