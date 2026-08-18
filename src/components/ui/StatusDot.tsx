export default function StatusDot() {
  return (
    <span className="relative size-1.5">
      <span className="bg-accent absolute inset-0 animate-ping rounded-full opacity-60" />
      <span className="bg-accent absolute inset-0 rounded-full" />
    </span>
  )
}
