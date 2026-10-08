export function Prompt({ command }: { command: string }) {
  return (
    <p className="text-sm">
      <span className="text-accent">chris@resume</span>
      <span className="text-dim">:</span>
      <span className="text-accent-dim">~</span>
      <span className="text-dim">$ </span>
      <span className="text-fg">{command}</span>
    </p>
  );
}
