# Checking the deck

Reading the code is not checking. A deck is finished only after every click of every slide has been rendered and looked at.

## 1. Run the checker

```bash
node scripts/verify_deck.mjs path/to/deck.html
```

It needs Node, Playwright (`npm i playwright`) and Chrome. If Playwright is installed somewhere else, set `PLAYWRIGHT_PATH` to its `index.mjs`; set `CHROME_PATH` to choose the browser.

It writes a `verification/` folder next to the deck:

- `s<slide>-click<n>.png` — one full-size image per click state
- `contact-sheet.png` — all states on one image, labelled `slide.click · words`
- `manifest.json` — what was rendered, plus problems and warnings

| Result | Meaning |
|---|---|
| **FAIL** | Something drawn outside the slide; a page error; a failed or external request; forward/back not returning to the same state |
| **WARN** | Text under 20 px; content larger than its box; more than 90 words on screen in one state |

Warnings are prompts to look, not verdicts. Fix them or be able to say why they stand.

## 2. Without Playwright

Chrome alone can render any state through the URL hash:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --virtual-time-budget=3000 --window-size=1920,1080 \
  --screenshot=s2-click3.png "file:///full/path/deck.html#2.3"
```

Loop over every slide and click. On Windows or Linux, use that system's Chrome or Edge path.

## 3. Look

Open the contact sheet, then any state that looks doubtful at full size. The script cannot see these:

- A title that wraps awkwardly or sits too close to the content
- Boxes in a row that are not aligned or evenly spaced
- A label overlapping an arrowhead; an arrow leaving from the wrong box
- A legend that no longer matches what it explains
- A missing border or colour
- Two things competing for attention on one click
- A click that adds almost nothing, or far too much
- A final state that reads as clutter rather than as a summary

Then go through the eye checks at the end of [visual-style.md](visual-style.md).

## 4. Check the content against the source

- Every number, name, decision and assignment on the slides matches the user's material.
- Anything you filled in yourself is listed for the user to confirm.
- A restyle changed no claim. If it did, say which.
- Each fact appears once.
- Notes have one entry per click, and hold the details taken off the slides.
- Nothing meant for another audience remains.

## 5. Report plainly

Say what was done and what was not:

- "All 16 click states rendered; none clipped or overflowing" — checked.
- "About 4 minutes at 140 words a minute" — an estimate until rehearsed.
- "Two wordings are mine and need your check: …" — assumptions.
- "Not published or shared; the previous version is kept as …" — status.

Never describe a local draft as published, or a passing script as a reviewed deck.
