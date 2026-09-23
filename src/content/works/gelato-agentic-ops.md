---
title: 'Gelato'
description: 'In-progress design for routing agent tasks. The public artifact maps six supporting layers around an operations control point.'
tech:
  - Agent orchestration
  - Route gates
  - Decision logs
order: 4
publishDate: 2026-09-01
---

## Status

This is a personal design, separate from employer work. The architecture map is the current public artifact. A live demo is not available yet.

## Layers

The map separates an operations control point from six supporting layers:

| Layer         | Function                                           |
| ------------- | -------------------------------------------------- |
| Orchestration | Route registry, gates, decision logs               |
| Gateway       | Auth, service graph, embed hooks                   |
| Delivery      | Build, test, and release hooks for agent workflows |
| Memory        | Specs, sources, sync between runs                  |
| Scenarios     | Fixtures, batch runs, pass or fail signals         |
| Models        | Inference and training hooks with human sign-off   |
| Outputs       | Drafts, listings, handoffs to humans               |

The design places execution behind recorded policy checks and human approval.
