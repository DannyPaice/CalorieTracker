"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addFoodEntry, type FoodEntryFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? "Adding..." : "Add food"}
    </Button>
  );
}

export function FoodEntryForm() {
  const [state, formAction] = useActionState<FoodEntryFormState, FormData>(
    addFoodEntry,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Food name</Label>
        <Input id="name" name="name" type="text" placeholder="e.g. Banana" />
        {state.errors?.name?.[0] && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField
          name="calories"
          label="Calories"
          placeholder="kcal"
          errors={state.errors?.calories}
        />
        <NumberField
          name="proteinG"
          label="Protein"
          placeholder="g"
          step="0.1"
          errors={state.errors?.proteinG}
        />
        <NumberField
          name="carbsG"
          label="Carbs"
          placeholder="g"
          step="0.1"
          errors={state.errors?.carbsG}
        />
        <NumberField
          name="fatG"
          label="Fat"
          placeholder="g"
          step="0.1"
          errors={state.errors?.fatG}
        />
      </div>

      {state.errors?._form?.[0] && (
        <p className="text-sm text-destructive">{state.errors._form[0]}</p>
      )}

      <SubmitButton />
    </form>
  );
}

function NumberField({
  name,
  label,
  placeholder,
  step,
  errors,
}: {
  name: string;
  label: string;
  placeholder?: string;
  step?: string;
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
        placeholder={placeholder}
      />
      {errors?.[0] && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
}