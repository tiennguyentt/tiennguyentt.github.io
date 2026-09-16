---
title: 'Gelato — Agentic Ops Platform'
description: 'Personal advisory-first control plane for a coding-agent fleet — observe run signals, recommend with evidence, and graduate autonomy only after decision-log proof.'
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

Running a fleet of coding agents (Claude Code, Codex CLI, and local routes) without a control plane turns into untracked burn, unclear ownership, and actions that cannot be audited. Free-form assistants skip evidence, blur who approved what, and treat the model host as the system of record.

I needed a platform I could own end to end — and show as a public product direction — where recommendations stay evidence-bound and autonomy is earned, not assumed.

## Decision

I designed **Gelato** as an advisory-first Agentic Ops control plane for a single-owner coding-agent substrate:

1. **Unify the interface, not the storage.** Hosts, git, issue trackers, and knowledge stores keep their sources of truth. Gelato consumes events through governed contracts.
2. **Deterministic spine first.** Event pipelines, typed tools, rules-as-data, decision logs, and Temporal workflows form the control plane. AI sits on top as reasoning and summarization — never as the authority for fleet-impacting actions.
3. **Autonomy ladder.** Everything starts as a recommendation to a human sponsor. Autonomous execution requires evidence quality, blast-radius limits, simulation-backed evaluation, and explicit approval.
4. **Fail closed on data classification.** Routing refuses missing classification. Private context never reaches providers or stores that are not authorized.

Operator surfaces stay thin and evidence-derived: chat, dash, and approve journeys that cannot invent requirements the contracts do not already carry.

## Outcome

- A documented architecture spanning control plane, core AI services, agentic SDLC, knowledge, simulation, DS/ML, and marketplace verticals — with contracts that make advisory → autonomy graduation auditable.
- Integration points defined so product, engineering, and agents share one decision log for matches and non-matches alike.
- Public framing stays on Gelato as a personal/demo platform. Employer-confidential work stays off this page.

**Number to remember:** advisory-first by default — zero fleet-impacting autonomous actions until decision-log completeness and evaluation gates pass.

## What interviewers can dig into

- How R0–R3 autonomy rungs map to Temporal workflows and human approval gates.
- Why model hosts are clients of the control plane, never the control plane.
- How operator console prototypes (chat, dash, approve) stay evidence-derived without inventing requirements in UI code.
