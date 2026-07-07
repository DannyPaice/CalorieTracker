"use client";

import { useTransition } from "react";
import { deleteFoodEntry } from "./actions";

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
      <p className="text-sm text-gray-500">No food logged yet today.</p>
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
    <li className="flex items-center justify-between text-sm border border-gray-200 rounded px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{entry.name}</p>
        <p className="text-xs text-gray-500">
          {entry.calories} kcal &middot; P {entry.proteinG}g &middot; C{" "}
          {entry.carbsG}g &middot; F {entry.fatG}g
        </p>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(() => deleteFoodEntry(entry.id))
        }
        className="text-xs text-red-600 hover:underline disabled:opacity-50 ml-3"
      >
        {isPending ? "..." : "Delete"}
      </button>
    </li>
  );
}