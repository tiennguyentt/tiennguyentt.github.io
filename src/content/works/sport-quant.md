---
title: 'Sport Quant'
description: 'Prediction-market research tool using Elo and Dixon-Coles estimates, fractional Kelly sizing, and a 1% exposure cap.'
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
5. **Gate** with deterministic risk rules and a 1% hard cap.
6. **Apply the rule in code.** The language model explains the calculation but cannot override the cap.

## Outcome

- Live demo: [tienntt-sport-quant.streamlit.app](https://tienntt-sport-quant.streamlit.app/)
- Source: [github.com/tiennguyentt/sport-quant](https://github.com/tiennguyentt/sport-quant)
- The 1% exposure cap is checked in code, outside the language model.
