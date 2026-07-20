export default function Khatam({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="5.75" y="5.75" width="12.5" height="12.5" rx="1" />
      <rect
        x="5.75"
        y="5.75"
        width="12.5"
        height="12.5"
        rx="1"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}
