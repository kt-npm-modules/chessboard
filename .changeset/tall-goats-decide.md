---
'@mirasen/chessboard': minor
---

Refines extension/rendering internals before third-party extension APIs stabilize.

Breaking for custom extension authors:

- SVG helper exports were split into visual/definition helpers.
- `defs` slots now expose `SVGDefsElement` directly instead of an extension-owned `<g>`.
- `extensionUnmountBase` now requires `extensionId` for ownership-safe `defs` cleanup.

Board/runtime initialization is now element-first. Most consumers using direct container-based board creation should not need migration changes.
