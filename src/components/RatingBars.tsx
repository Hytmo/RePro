function Bar({label, value}: {label: string; value: number}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-sm text-ink-soft">{label}</span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
        <span className="block h-full rounded-full bg-brand-500" style={{width: `${pct}%`}} />
      </span>
      <span className="w-8 shrink-0 text-right text-sm font-medium text-ink">{value.toFixed(1)}</span>
    </div>
  );
}

export default function RatingBars({
  labels,
  quality,
  value,
  communication,
  punctuality
}: {
  labels: {quality: string; value: string; communication: string; punctuality: string};
  quality: number;
  value: number;
  communication: number;
  punctuality: number;
}) {
  return (
    <div className="space-y-2.5">
      <Bar label={labels.quality} value={quality} />
      <Bar label={labels.value} value={value} />
      <Bar label={labels.communication} value={communication} />
      <Bar label={labels.punctuality} value={punctuality} />
    </div>
  );
}
