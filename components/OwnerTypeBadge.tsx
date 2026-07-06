import { FIRM_TYPE_COLOR, FIRM_TYPE_LABEL, type FirmType } from "@/lib/types";

// One consistent legend everywhere: PE vs the non-PE institutional owners we
// label honestly rather than lumping in as "private equity".
export default function OwnerTypeBadge({
  type,
  size = "sm",
}: {
  type: FirmType;
  size?: "sm" | "xs";
}) {
  const color = FIRM_TYPE_COLOR[type];
  const pad = size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${pad}`}
      style={{ borderColor: color, color }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      {FIRM_TYPE_LABEL[type]}
    </span>
  );
}
