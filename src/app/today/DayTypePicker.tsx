"use client";

import { useTransition } from "react";
import { pickDayType } from "./actions";

type DayType = {
  id: string;
  name: string;
};

type Props = {
  dayTypes: DayType[];
  currentDayTypeId: string | null;
};

export function DayTypePicker({ dayTypes, currentDayTypeId }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2 flex-wrap">
      {dayTypes.map((dt) => {
        const isSelected = dt.id === currentDayTypeId;
        return (
          <button
            key={dt.id}
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => pickDayType(dt.id))}
            className={`px-3 py-1.5 rounded text-sm font-medium border ${
              isSelected
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:bg-gray-50"
            } disabled:opacity-50`}
          >
            {dt.name}
          </button>
        );
      })}
    </div>
  );
}