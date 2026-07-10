"use client";

import { useTransition } from "react";
import { pickDayType } from "./actions";
import { Button } from "@/components/ui/button";

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
    <div className="grid grid-cols-3 gap-2">
      {dayTypes.map((dt) => {
        const isSelected = dt.id === currentDayTypeId;
        return (
          <Button
            key={dt.id}
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="lg"
            disabled={isPending}
            onClick={() => startTransition(() => pickDayType(dt.id))}
            className="h-14"
          >
            {dt.name}
          </Button>
        );
      })}
    </div>
  );
}