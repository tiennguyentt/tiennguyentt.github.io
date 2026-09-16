---
title: 'GSM Agentic Ops Platform'
description: 'Advisory-first control plane for a regulated US insurer — observe fleet signals, recommend with evidence, and graduate autonomy only after decision-log proof.'
tech:
  - Agentic Ops
  - Temporal
  - Decision logs
  - Policy gates
  - Claude / Codex
order: 1
publishDate: 2026-09-01
---

## Before

Colonial Surety needed a team-level agent-operated PM workflow inside a regulated insurance and surety environment. The risk was familiar: free-form AI assistants that skip audit trails, blur who approved what, and treat model hosts as the system of record.

Vague AI initiatives were arriving faster than integration plans. Engineering needed scoped, source-traced work — not another chatbot demo.

## Decision

I owned the platform direction as an **advisory-first Agentic Ops control plane**:

1. **Unify the interface, not the storage.** Hosts, git, issue trackers, and knowledge stores keep their sources of truth. The platform consumes events through governed contracts.
2. **Deterministic spine first.** Event pipelines, typed tools, rules-as-data, decision logs, and Temporal workflows form the control plane. AI sits on top as reasoning and summarization — never as the authority for fleet-impacting actions.
3. **Autonomy ladder.** Everything starts as a recommendation to a human sponsor. Autonomous execution requires evidence quality, blast-radius limits, simulation-backed evaluation, and explicit approval.
4. **Fail closed on data classification.** Routing refuses missing classification. Private context never reaches providers or stores that are not authorized.

The same logic is being adapted into Gelato for a coding-agent fleet on a single-owner substrate (OmniAgent runtime, policy service, model gateway, operator console journeys).

## Outcome

- End-to-end ownership of discovery → scope → control → sign-off → adoption for the regulated deployment.
- A documented architecture spanning control plane, core AI services, agentic SDLC, Nexus knowledge, simulation, DS/ML, and marketplace verticals — with contracts that make advisory → autonomy graduation auditable.
- Integration points defined so product, engineering, and agents share one decision log for matches and non-matches alike.

**Number to remember:** advisory-first by default — zero fleet-impacting autonomous actions until decision-log completeness and evaluation gates pass.

## What interviewers can dig into

- How R0–R3 autonomy rungs map to Temporal workflows and human approval gates.
- Why model hosts (Claude Code, Codex CLI) are clients of the control plane, never the control plane.
- How Gelato’s operator console prototypes (chat, dash, approve) stay evidence-derived without inventing requirements in UI code.
