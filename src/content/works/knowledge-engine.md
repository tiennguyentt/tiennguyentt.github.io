---
title: 'Knowledge Engine'
description: 'Turns meeting notes into a source-linked wiki and checks requirements against the source before human sign-off.'
tech:
  - Multi-model agents
  - Source-linked wiki
  - Spec grading
  - Streamlit
link: https://tienntt-knowledge-engine.streamlit.app/
order: 1
publishDate: 2026-06-15
---

## Before

Meeting notes can conflict, and requirements can lose their source by the time engineering receives them. An AI-written spec can sound certain even when the notes are not.

I wanted a workflow I could use myself and demonstrate publicly, with source links for each claim and my review before handoff.

## Decision

I built **Knowledge Engine** with Claude and Codex. Following the Karpathy LLM Knowledge Base pattern, it keeps notes and derived specs linked:

1. **Ingest** raw meetings and notes.
2. **Trace** into a source-linked wiki.
3. **Check** conflicts against a source hierarchy and flag unresolved claims for review.
4. **Grade** specs for clarity and coverage before engineering handoff.
5. **Sign off.** I review the changes before the spec goes to engineering.

Agent skills and subagents handle the steps. Source links and the reviewed changes show what they did.

## Outcome

- Hosted app: [tienntt-knowledge-engine.streamlit.app](https://tienntt-knowledge-engine.streamlit.app/)
- Requirements and acceptance criteria retain links to the meeting notes they came from.
- I use the same source checks and approval step in my other agent projects.

## Demo

The Streamlit app shows how a transcript becomes a wiki entry and a reviewed spec.
