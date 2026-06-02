# tiennguyentt.github.io

Source for my personal site at [tiennguyentt.github.io](https://tiennguyentt.github.io/).

Plain static HTML/CSS — no build step. Edit `index.html` / `style.css` and push to `main`; GitHub Pages serves it.

## Resume (CV)

The CV PDF is generated from its HTML source — **always edit `cv.html`, never the PDF directly.**

Regenerate `Tien-Nguyen-CV.pdf` after editing `cv.html`:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="Tien-Nguyen-CV.pdf" "file://$(pwd)/cv.html"
```

Then commit both `cv.html` and `Tien-Nguyen-CV.pdf`.
