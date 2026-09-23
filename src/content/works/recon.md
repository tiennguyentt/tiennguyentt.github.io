---
title: 'Recon'
description: 'Each daily report shows source links and scores for relevance, credibility, and predictive weight.'
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

I wanted a daily research report that showed why each item was included. A summary without sources or scores made it hard to review the result later.

## Decision

I built **Recon** to collect and score research items each day:

1. **Sweep** sources on a daily cadence with Claude Code agents.
2. **Produce** structured reports instead of free-form dumps.
3. **Score** every signal for relevance, credibility, and predictive weight.
4. **Update** its weight when later outcomes show how useful the signal was.

Predictive weight records how strongly a signal counts in later reports. Each report keeps the source and scores visible for review.

## Outcome

- Hosted app: [tienntt-recon.streamlit.app](https://tienntt-recon.streamlit.app/)
- Each report shows the item's relevance, source credibility, and predictive weight.
