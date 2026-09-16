---
title: 'Knowledge Engine'
description: 'Public operating model for agent-run PM work: transcripts become a source-traced wiki, conflicts resolve by truth hierarchy, specs get graded, humans sign the diff.'
tech:
  - Multi-model agents
  - Karpathy KB pattern
  - Spec grading
  - Streamlit
link: https://tienntt-knowledge-engine.streamlit.app/
order: 2
publishDate: 2026-06-15
---

## Before

Product work in regulated and multi-stakeholder environments dies in the gap between meetings and engineering. Notes conflict. Specs drift. Agents that “help write requirements” often invent certainty without sources.

I needed a workflow I could run myself — and show publicly — where every claim stays tied to evidence and every handoff has a human gate.

## Decision

I built **Knowledge Engine**, a multi-model agent system (Claude and Codex today, model-agnostic by design) on the Karpathy LLM Knowledge Base pattern:

1. **Ingest** raw meetings and notes.
2. **Trace** into a source-linked wiki.
3. **Check** conflicts using an explicit source truth hierarchy.
4. **Grade** specs for clarity and coverage before they leave the PM desk.
5. **Sign off** — I review the diff; engineering only sees what I approve.

The system runs agent skills and subagents against that loop so the operating model is inspectable, not theatrical.

## Outcome

- Live demo: [tienntt-knowledge-engine.streamlit.app](https://tienntt-knowledge-engine.streamlit.app/)
- A repeatable PM workflow that turns conflicting discovery into BRD/SRS-quality acceptance criteria with source links.
- The same pattern informs the GSM / Gelato deployment work: advisory surfaces, evidence references, and human accountability before production.

**Number to remember:** five gated stages from raw transcript to human-signed engineering handoff.

## Demo

Open the Streamlit app and walk the pipeline. Ask how conflict resolution chooses between sources, and what “graded” means before a spec is allowed to ship.
