# BOB Career DNA Engine v0.1

BOB Career DNA Engine is a local-first Next.js prototype for reconstructing likely banking operations exposure from resume content and job history. It is **not an ATS** and it does not rank candidates by keyword stuffing. Instead, it demonstrates mocked inference across employer history, operating function, asset class, responsibility language, and recruiter screening signals.

## Features

- Premium dark navy interface with gold accents.
- Job description textarea.
- Resume upload for `.txt` and `.pdf`, plus direct resume paste support.
- Local mock inference logic with no API dependency.
- Internal knowledge base for Wells Fargo, State Street, JPMorgan, Goldman Sachs, Broadridge, Accenture, and Deutsche Bank.
- Recruiter-style Career DNA report card with:
  - Company names
  - Job titles
  - Years of experience
  - Locations
  - Responsibilities
  - Likely asset class
  - Explicit skills
  - Inferred skills
  - Confidence score
  - Reasoning and screening notes

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

PDF handling in v0.1 is intentionally lightweight and local. Selectable-text PDFs may provide extractable text through the browser; pasted resume text or `.txt` files produce the best mock inference results.
