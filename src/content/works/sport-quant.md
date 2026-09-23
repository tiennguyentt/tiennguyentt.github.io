---
title: 'Sport Quant'
description: 'Elo and Dixon-Coles estimate match probabilities. Fractional Kelly sizes positions, capped at 1% in code.'
tech:
  - Elo / Dixon-Coles
  - Fractional Kelly
  - Risk gates
  - Streamlit
link: https://tienntt-sport-quant.streamlit.app/
repo: https://github.com/tiennguyentt/sport-quant
order: 2
publishDate: 2025-09-01
---

## Before

I wanted to test whether match models found a price difference worth examining. The language model could explain a result, but it should not set the size of a position.

## Decision

I built **Sport Quant** with separate scoring, sizing, and risk checks:

1. **Ingest** market and match data.
2. **Score** with an Elo + Dixon-Coles ensemble.
3. **Find edge** relative to market prices.
4. **Size** with fractional Kelly.
5. **Gate** with deterministic risk rules that cap each position at 1%.
6. **Apply the cap in code.** The language model explains the calculation but cannot override it.

## Outcome

- Hosted app: [tienntt-sport-quant.streamlit.app](https://tienntt-sport-quant.streamlit.app/)
- Source: [github.com/tiennguyentt/sport-quant](https://github.com/tiennguyentt/sport-quant)
- Code rejects positions above the 1% cap. The language model cannot change that rule.
