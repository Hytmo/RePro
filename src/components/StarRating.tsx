function Row({size}: {size: number}) {
  return (
    <span className="flex" style={{gap: '1px'}}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </span>
  );
}

export default function StarRating({
  value,
  size = 16,
  showValue = false,
  count
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${value.toFixed(1)} out of 5`}>
      <span className="relative inline-block leading-none" style={{height: size}}>
        <span className="text-border">
          <Row size={size} />
        </span>
        <span className="absolute inset-0 overflow-hidden text-accent-500" style={{width: `${pct}%`}}>
          <Row size={size} />
        </span>
      </span>
      {showValue && <span className="text-sm font-medium text-ink">{value.toFixed(1)}</span>}
      {typeof count === 'number' && <span className="text-xs text-muted">({count})</span>}
    </span>
  );
}
