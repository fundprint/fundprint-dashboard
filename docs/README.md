# docs/ — the Fundprint dashboard contract

This folder describes **how the public dashboard communicates with the rest of the system**, not what code currently exists. It is the contract layer. Components, charts, and routes will be rebuilt many times; these documents define what any version of the dashboard must respect.

If a doc here disagrees with the code, the doc is the intent. Either the code is wrong, or the doc is stale — either way, fix it before shipping the next change.

## Reading order

If you are new to the dashboard, read in this order:

1. **architecture.md** — the five layers of the dashboard and how data flows from the dataset to the screen.
2. **data-contract.md** — the read-only views and dataset the dashboard is allowed to read, and the shapes that flow in.
3. **search.md** — the "Is your clinic PE-owned?" lookup, the dashboard's core feature.
4. **visualization.md** — the maps, timelines, and tables, and what each is allowed to claim.
5. **copy-and-claims.md** — the editorial gate: framing, labels, citations, and the neutral-on-ABA line.
6. **deployment.md** — how the dashboard reaches the public and how a release is pinned to a dataset version.
7. **cross-repo.md** — how this repo coordinates with `fundprint-data` and `fundprint-methodology`.

Each doc opens with: *what it owns*, *what it depends on*, *what consumes it*. That triple is the contract.

## What these docs are not

- They are **not** component documentation. Prop-level and hook-level docs live next to the code.
- They are **not** a tutorial. They assume basic familiarity with the project's goals and tech stack (Next.js, Vercel, a Postgres source).
- They are **not** the methodology. "What counts as PE-backed" lives in `fundprint-methodology`. These docs describe how *whatever the methodology says* gets displayed.
- They are **not** the data pipeline. How a number is computed lives in `fundprint-data`. The dashboard reads the number; it never recomputes it.

## When to update these docs

Update a doc **before** changing the contract it describes. Sequence:

1. Open a draft change to the relevant doc.
2. Get the change approved (the data repo may need to expose a new view first).
3. Implement code against the new contract.
4. Merge the doc and code together.

Never update the doc to "match what the code now does" after the fact. That inverts the contract.

## A note on framing

Every doc here treats the dashboard as a **consumer** sitting downstream of a **trust boundary** it does not control. At that boundary, three questions must always have an answer:

- What can the dashboard assume the dataset guarantees?
- What must the dashboard verify or refuse to display itself?
- What is shown to the user so they can trace any number back to its source?

The dashboard is the most public surface of the whole project. A single misleading chart, a derived number that cannot be reproduced, or a careless line of copy about autistic children is the failure mode that a screenshot makes permanent. If you cannot answer those three questions for a change you are about to make, you are about to put that screenshot into the world.
