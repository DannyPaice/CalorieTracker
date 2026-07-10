type Props = {
  consumed: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  targets: {
    targetCalories: number;
    targetProteinG: number;
    targetCarbsG: number;
    targetFatG: number;
  };
};

export function TotalsBar({ consumed, targets }: Props) {
  return (
    <div className="space-y-4">
      <MacroBar
        label="Calories"
        consumed={consumed.calories}
        target={targets.targetCalories}
        unit="kcal"
        color="bg-blue-500"
      />
      <MacroBar
        label="Protein"
        consumed={consumed.proteinG}
        target={targets.targetProteinG}
        unit="g"
        color="bg-emerald-500"
      />
      <MacroBar
        label="Carbs"
        consumed={consumed.carbsG}
        target={targets.targetCarbsG}
        unit="g"
        color="bg-amber-500"
      />
      <MacroBar
        label="Fat"
        consumed={consumed.fatG}
        target={targets.targetFatG}
        unit="g"
        color="bg-rose-500"
      />
    </div>
  );
}

function MacroBar({
  label,
  consumed,
  target,
  unit,
  color,
}: {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min((consumed / target) * 100, 100);
  const over = consumed > target;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline text-sm">
        <span className="font-medium">{label}</span>
        <span
          className={
            over ? "text-destructive font-medium" : "text-muted-foreground"
          }
        >
          {Math.round(consumed)}{" "}
          <span className="text-xs">
            / {target} {unit}
          </span>
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            over ? "bg-destructive" : color
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}