"use client";

import { useTransition } from "react";
import { deleteFoodEntry } from "./actions";
import { Button } from "@/components/ui/button";

type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

type Props = {
  entries: FoodEntry[];
};

export function FoodEntryList({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No food logged yet today.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <FoodEntryRow key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

function FoodEntryRow({ entry }: { entry: FoodEntry }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{entry.name}</p>
        <p className="text-xs text-muted-foreground">
          {entry.calories} kcal &middot; P {entry.proteinG}g &middot; C{" "}
          {entry.carbsG}g &middot; F {entry.fatG}g
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => deleteFoodEntry(entry.id))}
        className="text-destructive"
      >
        {isPending ? "..." : "Delete"}
      </Button>
    </li>
  );
}