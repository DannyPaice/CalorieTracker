"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addFoodEntry, type FoodEntryFormState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-black text-white px-4 py-2 rounded font-medium disabled:opacity-50 col-span-full"
    >
      {pending ? "Adding..." : "Add food"}
    </button>
  );
}

export function FoodEntryForm() {
  const [state, formAction] = useActionState<FoodEntryFormState, FormData>(
    addFoodEntry,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Reset the form on successful submission so the user can log the next food
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-2 gap-3 max-w-md"
    >
      <div className="col-span-full space-y-1">
        <label className="text-sm font-medium block" htmlFor="name">
          Food name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        {state.errors?.name?.[0] && (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <NumberField
        name="calories"
        label="Calories"
        errors={state.errors?.calories}
      />
      <NumberField
        name="proteinG"
        label="Protein (g)"
        step="0.1"
        errors={state.errors?.proteinG}
      />
      <NumberField
        name="carbsG"
        label="Carbs (g)"
        step="0.1"
        errors={state.errors?.carbsG}
      />
      <NumberField
        name="fatG"
        label="Fat (g)"
        step="0.1"
        errors={state.errors?.fatG}
      />

      {state.errors?._form?.[0] && (
        <p className="text-sm text-red-600 col-span-full">
          {state.errors._form[0]}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function NumberField({
  name,
  label,
  step,
  errors,
}: {
  name: string;
  label: string;
  step?: string;
  errors?: string[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium block" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        step={step ?? "1"}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      {errors?.[0] && <p className="text-sm text-red-600">{errors[0]}</p>}
    </div>
  );
}