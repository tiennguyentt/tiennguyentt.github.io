---
title: 'Colonial Surety delivery'
description: 'Regulated B2B insurance and payments delivery: 7-product bundling, B2B SSO, and a PCI-aware emergency gateway migration with a five-developer team.'
tech:
  - Insurance
  - Payments
  - PCI
  - B2B SSO
  - Scrum
order: 3
publishDate: 2026-02-01
---

## Before

Colonial Surety’s product surface spans surety, insurance bundling, partner access, and payment rails. Delivery pressure is high; compliance is non-negotiable. An emergency gateway migration had to pass Fiserv PCI scrutiny across multiple platforms without stalling the broader roadmap.

## Decision

As Product Management Engineer in a ~20-developer org, I owned scoping, sequencing, and the engineering handoff for several high-risk tracks:

1. **Seven-product insurance bundling** — capability design that let partners compose products without exploding operational edge cases.
2. **B2B SSO provider** — partner and enterprise access with clear ownership of identity boundaries.
3. **Payment gateway migration** — a small team (~5 developers) executing a parameter matrix migration that had to satisfy PCI controls across three platforms.

The method matches how I run agentic work later: make the non-deterministic parts explicit, keep an accountable human on every change that matters, and do not ship “almost compliant.”

## Outcome

- Shipped the 7-product bundling capability into the live product set.
- Delivered B2B SSO for partner and enterprise access.
- Completed the gateway migration that passed Fiserv PCI compliance across 3 platforms.

**Number to remember:** PCI-passing gateway migration with a five-developer team across three platforms.

## What interviewers can dig into

- How the payment-parameter matrix was structured for migration risk.
- Where product ownership sat relative to compliance evidence.
- How this delivery work informs later governed / agentic product work: same audit instincts, higher automation ambition — without publishing employer platform internals.
