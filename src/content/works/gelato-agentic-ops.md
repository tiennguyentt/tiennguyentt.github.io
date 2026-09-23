---
title: 'Gelato'
description: 'In-progress personal project for routing agents, recording decisions, and requiring approval before execution.'
tech:
  - Agent orchestration
  - Route gates
  - Decision logs
order: 4
publishDate: 2026-09-01
---

## Status

This is personal research, separate from employer work. There is no public demo yet.

## Layers

The current design separates routing, model access, test scenarios, and review:

| Layer         | Function                                           |
| ------------- | -------------------------------------------------- |
| Orchestration | Route registry, gates, decision logs               |
| Gateway       | Auth, service graph, embed hooks                   |
| Delivery      | Build, test, and release hooks for agent workflows |
| Memory        | Specs, sources, sync between runs                  |
| Scenarios     | Fixtures, batch runs, pass or fail signals         |
| Models        | Inference and training hooks with human sign-off   |
| Outputs       | Drafts, listings, handoffs to humans               |

Execution stays behind recorded checks and human approval.
