// A large, faint case-file stamp bled into the bottom corner of the desk.
// Fixed and decorative (aria-hidden), sitting below the content sheets.
export default function DeskWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed -bottom-6 -right-6 z-0 hidden select-none opacity-[0.07] md:block"
      style={{ transform: "rotate(-14deg)" }}
    >
      <div className="border-[3px] border-double border-pe px-6 py-3 text-right">
        <div className="font-display text-4xl font-bold uppercase leading-none tracking-wider text-pe">
          Case File
        </div>
        <div className="mt-1 font-mono text-sm uppercase tracking-[0.3em] text-pe">
          FP&middot;2026 / Confidential
        </div>
      </div>
    </div>
  );
}
