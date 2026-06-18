type BrandSealProps = {
  className?: string;
  title?: string;
};

/**
 * RePro "Verified Seal" mark. The scalloped disc uses `currentColor`, so set
 * the colour with a text utility (e.g. `text-brand-600`). Ring + check are white.
 */
export default function BrandSeal({className, title}: BrandSealProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
      <circle cx="90.969" cy="50.000" r="5.531" />
      <circle cx="87.851" cy="65.678" r="5.531" />
      <circle cx="78.970" cy="78.970" r="5.531" />
      <circle cx="65.678" cy="87.851" r="5.531" />
      <circle cx="50.000" cy="90.969" r="5.531" />
      <circle cx="34.322" cy="87.851" r="5.531" />
      <circle cx="21.030" cy="78.970" r="5.531" />
      <circle cx="12.149" cy="65.678" r="5.531" />
      <circle cx="9.031" cy="50.000" r="5.531" />
      <circle cx="12.149" cy="34.322" r="5.531" />
      <circle cx="21.030" cy="21.030" r="5.531" />
      <circle cx="34.322" cy="12.149" r="5.531" />
      <circle cx="50.000" cy="9.031" r="5.531" />
      <circle cx="65.678" cy="12.149" r="5.531" />
      <circle cx="78.970" cy="21.030" r="5.531" />
      <circle cx="87.851" cy="34.322" r="5.531" />
      <circle cx="50.000" cy="50.000" r="40.969" />
      </g>
      <circle cx="50.000" cy="50.000" r="29.498" fill="none" stroke="#fff" strokeWidth="2.950" />
      <path d="M38.758,51.204 L47.390,59.034 L62.045,41.368" fill="none" stroke="#fff" strokeWidth="5.531" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
