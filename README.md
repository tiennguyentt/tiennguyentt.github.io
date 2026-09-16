# tiennguyentt.github.io

Personal portfolio site (static HTML/CSS/JS — no build step).

## Hosting

- **Primary (in progress):** [Vercel](https://vercel.com) project **`personal`** (slug; display name Personal) — home for this portfolio and later personal apps. Push to `main` deploys production once the GitHub integration is linked; preview deploys on PRs.
- **Legacy:** [GitHub Pages](https://tiennguyentt.github.io/) still serves this repo until cutover.

Custom domain is deferred until the agentic demos are further along. Until then, use the `*.vercel.app` URL from the `personal` project.

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
