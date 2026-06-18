function Bar({label, value}: {label: string; value: number}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="grid gap-2 sm:grid-cols-[10rem_1fr_2.5rem] sm:items-center">
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
      <span className="h-3 overflow-hidden rounded-full bg-surface-2">
        <span
          className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-lux-500),var(--color-brand-500))]"
          style={{width: `${pct}%`}}
        />
      </span>
      <span className="text-right text-sm font-black text-ink">{value.toFixed(1)}</span>
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
    <div className="space-y-4">
      <Bar label={labels.quality} value={quality} />
      <Bar label={labels.value} value={value} />
      <Bar label={labels.communication} value={communication} />
      <Bar label={labels.punctuality} value={punctuality} />
    </div>
  );
}
