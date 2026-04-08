---
description: How to add a new shared UI component to @vct/ui package
---
// turbo-all

# /new-component {Name}

AGENT: NOVA (single agent, no handoff needed)

## Step 1 — Create files
```powershell
$name = "{Name}"
$base = "D:\VCT PLATFORM\vct-platform\core\packages\ui\src\components\$name"
New-Item -ItemType Directory -Force -Path $base
New-Item -Force "$base\$name.tsx","$base\types.ts","$base\index.ts"
```

## Step 2 — Implement component
Use design tokens from shared/design-tokens.md. Dark mode only.
Card: bg-slate-900/40 border border-slate-800 backdrop-blur-md rounded-xl
Glow: hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]
Focus: focus-visible:ring-2 focus-visible:ring-cyan-500

## Step 3 — Export from package
Add to `core/packages/ui/src/index.ts`

## Step 4 — Build verify
```powershell
cd D:\VCT PLATFORM\vct-platform ; npx turbo run build --filter=@vct/ui
```
