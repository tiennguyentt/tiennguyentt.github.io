---
title: 'Sport Quant'
description: 'Governed +EV terminal for prediction markets. Elo and Dixon-Coles score the edge. Fractional Kelly and hard caps set size. Models advise; code governs.'
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

Prediction-market tooling often lets an LLM narrate an edge and then quietly becomes the decision maker. That fails the same way ungoverned agent ops fail: no deterministic gate, no hard caps, no separation between advice and action.

## Decision

I engineered **Sport Quant** as a governed +EV terminal:

1. **Ingest** market and match data.
2. **Score** with an Elo + Dixon-Coles ensemble.
3. **Find edge** relative to market prices.
4. **Size** with fractional Kelly.
5. **Gate** with deterministic risk rules and a 1% hard cap.
6. **Decide** in code — the LLM explains; it does not authorize the bet.

## Outcome

- Live demo: [tienntt-sport-quant.streamlit.app](https://tienntt-sport-quant.streamlit.app/)
- Source: [github.com/tiennguyentt/sport-quant](https://github.com/tiennguyentt/sport-quant)
- A concrete instance of the product principle I use on enterprise agent platforms: **models advise, code decides.**

**Number to remember:** 1% hard cap on sized exposure, enforced outside the model.
