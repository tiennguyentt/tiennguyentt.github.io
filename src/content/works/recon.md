---
title: 'Recon'
description: 'Autonomous research intelligence pipeline: daily agent sweeps, structured reports, and a weighting engine that scores relevance, credibility, and predictive weight over time.'
tech:
  - Claude Code agents
  - Signal scoring
  - Research ops
  - Streamlit
link: https://tienntt-recon.streamlit.app/
order: 3
publishDate: 2025-11-01
---

## Before

Manual research sweeps do not scale when you need continuous market and domain signal. Unscored LLM summaries also do not scale — they look complete while accuracy drifts.

## Decision

I built **Recon**, an autonomous AI news and research intelligence pipeline:

1. **Sweep** sources on a daily cadence with Claude Code agents.
2. **Produce** structured reports instead of free-form dumps.
3. **Score** every signal for relevance, credibility, and predictive weight.
4. **Adjust** signal importance through a proprietary weighting engine as outcomes arrive.

Models gather and explain; the scoring layer keeps the system honest over time.

## Outcome

- Live demo: [tienntt-recon.streamlit.app](https://tienntt-recon.streamlit.app/)
- A research ops loop that treats signal quality as a tracked product, not a one-off brief.

**Number to remember:** every signal carries three scores — relevance, credibility, predictive weight — and those scores update as outcomes land.
