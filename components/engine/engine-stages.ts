// The five real pipeline layers, described as the stages of one machine. Copy
// and numbers are the single source of truth for both the static SVG diagram
// and the 3D scene, so the two never drift.

export type EngineStage = {
  key: string;
  numeral: string; // I .. V
  name: string;
  verb: string; // one-word action on the shaft
  glyph: "intake" | "store" | "resolve" | "validate" | "publish";
  metric: string; // the headline number at this stage
  line: string; // one-line description
  detail: string; // a sentence of depth for the callout / scene panel
};

export const ENGINE_STAGES: EngineStage[] = [
  {
    key: "acquire",
    numeral: "I",
    name: "Acquire",
    verb: "intake",
    glyph: "intake",
    metric: "649 + 255 records in",
    line: "Pull public records from two registries.",
    detail:
      "The federal NPPES provider registry (649) plus owners' own machine-readable location directories (255). Every page is fetched and content-hashed on the way in.",
  },
  {
    key: "store",
    numeral: "II",
    name: "Store",
    verb: "snapshot",
    glyph: "store",
    metric: "pgvector + snapshots",
    line: "Snapshot and embed every source.",
    detail:
      "Nothing advances without a stored, hashed copy of the document behind it. Names are embedded as vectors in Postgres so the resolver can reason over them.",
  },
  {
    key: "resolve",
    numeral: "III",
    name: "Resolve",
    verb: "match",
    glyph: "resolve",
    metric: "clinic → owner → firm",
    line: "Assemble the ownership chain.",
    detail:
      "A deterministic name matcher links clinics to owner entities and owner entities to their parent financial firm. Chain confidence is the weakest link along the chain.",
  },
  {
    key: "validate",
    numeral: "IV",
    name: "Validate",
    verb: "gate",
    glyph: "validate",
    metric: "95% hand-checked gate",
    line: "Hold everything to the floors.",
    detail:
      "Confidence floors and a 95% hand-validation gate. Contradicted or under-confidence claims are quarantined, not published. Over-matched brand names are rejected.",
  },
  {
    key: "publish",
    numeral: "V",
    name: "Publish",
    verb: "emit",
    glyph: "publish",
    metric: "verified chains out",
    line: "Emit the pinned snapshot.",
    detail:
      "Only claims that clear validation are written to the frozen snapshot this site reads. Every published claim carries the source that proves it.",
  },
];
