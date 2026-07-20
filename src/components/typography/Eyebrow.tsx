export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-accent mb-3 inline-block font-sans text-[0.65rem] tracking-[0.18em] uppercase">
      {children}
    </span>
  );
}
