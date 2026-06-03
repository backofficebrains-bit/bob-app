# BOB First Engagement Command Center v0.2

BOB (Back Office Brains) is a local-first Next.js prototype for proving the first controlled Investment Banking Operations automation engagement. The app now focuses on trade lifecycle and Murex-style operational breaks instead of resume inference.

## What this build proves

- A mock Murex / IB Ops queue with FX settlement, equity reconciliation, and OTC confirmation breaks.
- Deterministic BOB triage that selects the highest-risk queue item for first engagement.
- CTO runbooks showing the exact automation steps BOB would perform.
- CFO controls that prevent unsafe book mutation and preserve maker-checker evidence.
- Unit economics showing manual minutes saved, token cost, labor-value saved, and ROI multiple.
- A unified CEO / CTO / CFO stand-up strip to keep execution focused on the first successful engagement.
- Integration into the existing `public/index.html` BOB chat app so GitHub/Vercel users see the command center and chat copilot in the same surface.

## First engagement target

The default first engagement is `FX-CLS-001`: a Murex MX.3 FX spot settlement break where CLS release is blocked by a missing counterparty SSI BIC on the outbound MT300 confirmation. BOB enriches the approved static data, rebuilds the confirmation payload, and routes the repair for maker-checker release before cut-off.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Prototype note

This is a controlled prototype with dummy queue data. It does not connect to production Murex, SWIFT, CLS, broker, or custody systems. The goal is to demonstrate the first safe automation engagement pattern before integrating live adapters.
