function Row({size, color}: {size: number; color: string}) {
  return (
    <span style={{display: 'flex', gap: '1px', lineHeight: 0, width: size * 5 + 4, color}}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{display: 'block', flex: 'none'}}
          aria-hidden="true"
        >
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
  const w = size * 5 + 4;
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${value.toFixed(1)} out of 5`}>
      <span style={{position: 'relative', display: 'inline-block', width: w, height: size, lineHeight: 0}}>
        <span style={{position: 'absolute', top: 0, left: 0}}>
          <Row size={size} color="var(--color-border)" />
        </span>
        <span style={{position: 'absolute', top: 0, left: 0, width: `${pct}%`, overflow: 'hidden'}}>
          <Row size={size} color="var(--color-accent-500)" />
        </span>
      </span>
      {showValue && <span className="text-sm font-medium text-ink">{value.toFixed(1)}</span>}
      {typeof count === 'number' && <span className="text-xs text-muted">({count})</span>}
    </span>
  );
}
