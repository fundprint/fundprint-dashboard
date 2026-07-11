import type { ReactNode } from "react";

// A margin annotation, like a reviewer's note in the file. On wide screens it
// hangs in the left margin; on narrow screens it sits inline above its content.
export default function MarginNote({ children }: { children: ReactNode }) {
  return (
    <aside className="mb-3 border-l-2 border-pe/40 pl-3 font-mono text-[0.72rem] leading-snug text-ink-muted sm:mb-0">
      {children}
    </aside>
  );
}
