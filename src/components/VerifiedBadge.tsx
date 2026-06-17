export default function VerifiedBadge({label}: {label: string}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
      <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 1l2.4 1.8 3 .1 1 2.8 2.2 2-1 2.8 1 2.8-2.2 2-1 2.8-3 .1L10 19l-2.4-1.8-3-.1-1-2.8-2.2-2 1-2.8-1-2.8 2.2-2 1-2.8 3-.1z" />
        <path d="M8.6 12.3L6.4 10l-1 1 3.2 3.2L15 7.8l-1-1z" fill="#fff" />
      </svg>
      {label}
    </span>
  );
}
