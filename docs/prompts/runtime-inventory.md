Inspect the current branch codebase and create a markdown file named `runtime-inventory.md`.

Scope:

- `src/index.ts`
- all files under `src/core/**`

For each file, write only:

1. file path
2. one-sentence responsibility
3. key exports (only important ones)
4. direct known usage inside the current codebase (`used by:`), if any

Rules:

- do not invent intent beyond what is supported by the code
- do not infer future architecture
- do not describe intended design unless directly evidenced by code
- if usage is unclear, write exactly: `Used by: not clearly referenced in current codebase`
- keep each file entry short
- focus especially on runtime/composition relevance:
  - state
  - renderer
  - scheduler
  - input
  - events
  - policy

At the end add these sections:

## Confirmed current runtime links

- list only runtime/composition links clearly evidenced by imports or direct calls

## Missing composition link

- identify the most obvious missing internal runtime/controller link
- keep it concrete and minimal
- do not propose public API design
- do not speculate beyond the current code

## Phase 2 relevance

- files already participating in runtime flow
- files that look like building blocks but are not yet wired together
- the smallest plausible first internal runtime/composition step

Output only the markdown file content.
