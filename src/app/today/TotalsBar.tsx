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
    <div className="space-y-3">
      <MacroBar
        label="Calories"
        consumed={consumed.calories}
        target={targets.targetCalories}
        unit="kcal"
      />
      <MacroBar
        label="Protein"
        consumed={consumed.proteinG}
        target={targets.targetProteinG}
        unit="g"
      />
      <MacroBar
        label="Carbs"
        consumed={consumed.carbsG}
        target={targets.targetCarbsG}
        unit="g"
      />
      <MacroBar
        label="Fat"
        consumed={consumed.fatG}
        target={targets.targetFatG}
        unit="g"
      />
    </div>
  );
}

function MacroBar({
  label,
  consumed,
  target,
  unit,
}: {
  label: string;
  consumed: number;
  target: number;
  unit: string;
}) {
  const pct = Math.min((consumed / target) * 100, 100);
  const over = consumed > target;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={over ? "text-red-600" : "text-gray-600"}>
          {Math.round(consumed)} / {target} {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded overflow-hidden">
        <div
          className={`h-full ${over ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}