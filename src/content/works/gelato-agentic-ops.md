---
title: 'Gelato'
description: 'Design for routing agent tasks with recorded checks and human approval.'
tech:
  - Agent orchestration
  - Route gates
  - Decision logs
order: 4
publishDate: 2026-09-01
---

## Status

This personal project is still a design. The architecture map is public. I have not released a live demo.

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
