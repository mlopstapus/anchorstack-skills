---
name: research
version: 1.0.0
tier: universal
description: BEARY-style agentic research pipeline — topic prompt to cited whitepaper.
---

# Research (BEARY-adapted)

You are running an agentic background research workflow, adapted from BEARY for Claude Code. Given a topic, you perform iterative web research, take structured notes, and compile a cited whitepaper.

## Step 1 — Topic intake

Ask for:
1. **Topic:** Short name used for file organization (no spaces, e.g. `multi-agent-systems`)
2. **Description:** What is this topic about, what questions should be answered?
3. **Purpose (optional):** Why are you researching this — exploration, decision support, client brief?
4. **Audience:** Who will read this — technical, executive, mixed?
5. **Source preferences:** Any domains to prioritize or exclude?
6. **Freshness:** How recent should sources be? (default: last 90 days preferred)
7. **Depth:** Quick brief (3–5 sources) or deep dive (10–20+ sources)?

## Step 2 — Initialize workspace

Create the research workspace:
```
beary-scratchpad/<topic>/
  notes.md          ← running research notes
  sources.md        ← bibliography as you go
  outline.md        ← whitepaper outline (built after initial research)
```

Add `beary-scratchpad/` to `.gitignore` if not already there.

## Step 3 — Research loop

Perform iterative web research. For each search pass:

1. Formulate a targeted search query based on the description and open questions
2. Search and read results
3. Extract key claims, data points, and quotes — note source URL and date
4. Append findings to `beary-scratchpad/<topic>/notes.md`
5. Append source to `beary-scratchpad/<topic>/sources.md` with: URL, title, date, credibility note
6. Identify what is still unanswered and formulate the next query

Continue until:
- All major questions in the description are addressed, OR
- The configured source depth is reached, OR
- Sources are becoming redundant (same information from multiple places)

Flag any contradictions between sources explicitly.

## Step 4 — Build outline

From your notes, build a logical whitepaper outline in `beary-scratchpad/<topic>/outline.md`. Present it to the user and ask for approval or adjustments before writing.

## Step 5 — Write whitepaper

Write the full whitepaper following the approved outline. Requirements:
- Every factual claim must have an inline citation `[^N]`
- Use headers, subheaders, and bullet points for scannability
- Include an executive summary at the top (3–5 sentences)
- Include a "Key takeaways" section
- End with a complete bibliography

## Step 6 — Output

Save to `research-output/<topic>-<YYYY-MM-DD>.md`.

Add `research-output/` to `.gitignore` if not already there, unless the user explicitly wants it committed.

Remind the user: LLMs hallucinate. Check citations for accuracy before sharing this work externally.
