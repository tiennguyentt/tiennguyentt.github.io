# tiennguyentt.github.io

Personal portfolio site (static HTML/CSS/JS — no build step).

## Hosting

- **Primary:** [Vercel](https://vercel.com) project **`portfolio`** — https://portfolio-tienntt.vercel.app  
  Linked to this GitHub repo; push to `main` deploys production; other branches get preview URLs.
- **Legacy:** [GitHub Pages](https://tiennguyentt.github.io/) still serves this repo until cutover.

Custom domain is deferred until the agentic demos are further along.

Local preview:

```sh
python3 -m http.server 8000
```

Or with the Vercel CLI after linking:

```sh
npx vercel
```

## Resume (CV)

The CV PDF is generated from its HTML source — **always edit `cv.html`, never the PDF directly.**

Regenerate `Tien-Nguyen-CV.pdf` after editing `cv.html`:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="Tien-Nguyen-CV.pdf" "file://$(pwd)/cv.html"
```

Then commit both `cv.html` and `Tien-Nguyen-CV.pdf`.
