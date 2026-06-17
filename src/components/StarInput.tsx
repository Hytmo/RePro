'use client';

import {useState} from 'react';

export default function StarInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            type="button"
            key={i}
            onMouseEnter={() => setHover(i)}
            onClick={() => onChange(i)}
            aria-label={`${label}: ${i}`}
            className="p-0.5"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill={i <= shown ? 'var(--color-accent-500)' : 'var(--color-border)'}
              style={{display: 'block'}}
            >
              <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
            </svg>
          </button>
        ))}
      </span>
    </div>
  );
}
