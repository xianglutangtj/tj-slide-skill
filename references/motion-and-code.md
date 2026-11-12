# Motion and code

Everything lives in one HTML file with no dependencies: `assets/starter/deck.html`. Copy it, keep the block marked `ENGINE` and the styles marked `SYSTEM`, and replace the three example slides. The `COMPONENT` styles are the building blocks from [visual-style.md](visual-style.md); reuse them before writing new ones.

## A slide

```html
<section class="frame" id="s-where">
  <div class="eyebrow">Project · Update · Date</div>
  <h1>The claim, as a short sentence</h1>
  <div class="content">
    <!-- position things inside this 1680 × 730 box with class="abs" and left/top -->
  </div>
  <aside class="notes">Click 1: … Click 2: …</aside>
</section>
```

Layout is absolute, in pixels, on purpose: a slide is a fixed picture, and exact positions keep rows aligned and make every click state predictable.

## The three attributes

| Attribute | Effect | Use for |
|---|---|---|
| `data-s="2"` | Hidden until click 2, then shown | Anything that should arrive |
| `data-e="4"` | With `data-s`: hidden again from click 4 | A detail that makes room for the next one |
| `data-dim="3"` | Stays, but faded and greyed from click 3 | A step that has been explained |

Elements without any of these are on the slide from the start (title, eyebrow, a legend). The number of clicks on a slide is the largest number used; nothing else needs declaring.

```html
<!-- Step 1 arrives on click 1 and recedes on click 2 -->
<div class="box done" data-s="1" data-dim="2" style="left:0;top:0;width:520px;height:140px">
  <span class="st">Step 1 · Reviewer</span>Check sample cases, revise the rules</div>

<!-- Its detail arrives with it and leaves when step 2 arrives -->
<div class="panel" data-s="1" data-e="2"> … </div>

<!-- Step 2 and its arrow arrive together: wrap them so one click brings both -->
<div data-s="2" data-dim="3">
  <svg class="abs" …><line … marker-end="url(#a2)"/></svg>
  <div class="box done" style="left:580px;top:0;width:520px;height:140px">…</div>
</div>
<div class="panel" data-s="2" data-e="3"> … </div>
```

## Motion rules

1. **One click, one unit of meaning.** A step and its explanation count as one unit and share a click.
2. **Words arrive with their shape.** Never reveal a label one click before or after the thing it names.
3. **Then it recedes or leaves.** `data-dim` for structure the audience still needs to see; `data-e` for detail they do not.
4. **Summaries arrive piece by piece** — solid, then not, then so — so the speaker can pause on each.
5. **Motion is small and quick:** a 0.32 s fade with a 14 px rise. No bounces, spins, slides across the screen or looping animation.
6. **Count the clicks.** Around 3–6 per slide. A slide that needs 10 is two slides; a click that adds two words can merge with its neighbour.
7. **Going back works.** Every state is computed from the click number, so the left arrow restores the previous picture exactly.

## Engine (already in the starter)

```js
// Fixed stage, scaled to the window
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);
  stage.style.transform=`scale(${s})`;
  stage.style.left=((innerWidth-1920*s)/2)+'px';stage.style.top=((innerHeight-1080*s)/2)+'px';}

// Each element's visibility is a pure function of the click number
function render(){
  frames.forEach((f,i)=>f.classList.toggle('active',i===si));
  const f=frames[si]; f.dataset.step=step;
  f.querySelectorAll('[data-s]').forEach(e=>{const s=num(e,'s'),x=num(e,'e');
    e.classList.toggle('shown',step>=s&&!(x&&step>=x));});
  f.querySelectorAll('[data-dim]').forEach(e=>e.classList.toggle('past',step>=num(e,'dim')));
  /* … page number, notes, URL hash … */ }
```

```css
[data-s]{opacity:0;visibility:hidden;transform:translateY(14px);
  transition:opacity .32s ease,transform .32s ease,filter .32s ease}
[data-s].shown{opacity:1;visibility:visible;transform:none}
[data-dim].past{opacity:.28;filter:grayscale(1)}
```

`visibility:hidden` matters: hidden elements cannot be clicked and are ignored by the checker.

**Custom states.** The active slide carries `data-step="<click>"`, so CSS can do anything the attributes cannot:

```css
#s-figure[data-step="2"] .ring-outer{opacity:.15}        /* mute a layer on click 2 */
#s-figure[data-step="3"] .ring-inner{stroke:var(--accent)} /* spotlight another on click 3 */
```

## Controls

| Key | Action |
|---|---|
| → · Space · Enter · PageDown · click | Next click, then next slide |
| ← · Backspace · PageUp | Back |
| Home / End | First slide / last state |
| N | Speaker notes panel |
| F | Full screen |

`deck.html#2.3` opens slide 2 at click 3 — useful for rehearsing one moment and for screenshots. Clicker remotes send PageDown/PageUp and work as they are.

## Drawing arrows and paths

Use one inline SVG per group, positioned with `class="abs"`, sized to the area it spans. Coordinates are in the SVG's own pixels.

```html
<svg class="abs" style="left:0;top:270px" width="1680" height="200" aria-hidden="true">
  <defs><marker id="a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="#00274c"/></marker></defs>
  <line x1="322" y1="100" x2="350" y2="100" stroke="#00274c" stroke-width="4" marker-end="url(#a1)"/>
</svg>
```

- Leave a 4 px gap between a box edge and the arrow so heads do not touch borders.
- Elbow paths: `M x y L x y L x y` with `fill="none"`.
- A "go back" path is dashed (`stroke-dasharray="12 9"`) in the warn colour, with its own marker in that colour.
- A marker `id` is global to the page: define it once and make sure the slide that defines it is not the only one using it — or define one per slide.
- Start a path at the box that makes the decision, not at the box next to it.
- Keep labels ("Yes") clear of arrowheads.

## Rows of equal boxes

For *n* boxes across 1680 px with gap *g*: width = (1680 − (n − 1) · g) / n. Give every box in the row the same `top` and `height`; place the arrow at the vertical centre.

## Things that go wrong

| Symptom | Cause | Fix |
|---|---|---|
| A border or text has no colour | A CSS variable that is not defined in `:root` (e.g. `var(--red)` after a palette rename) | Search the file for every `var(--…)` after renaming tokens |
| Legend does not match the boxes | Restyled the boxes, forgot the swatch | Draw the swatch with the same fill and border |
| Title runs into the content | Title wrapped to two lines | Keep content at `top:260px` or shorten the title |
| Text spills out of a box | Fixed height, too many words | Cut words; the checker warns about this |
| An arrow appears before its box | Arrow and box have different `data-s` | Wrap both in one `data-s` element |
| Slide needs an extra dead click | A stray higher number in `data-e` or `data-dim` | The highest number used should be a click where something visibly changes |
| Works on screen, breaks in a meeting room | External font, image or script | Inline everything; the checker fails on external requests |

## Links and images

- Links work (`<a href>`); clicking one does not advance the slide.
- Embed images as files next to the deck or as data URIs, with `alt` text when they carry evidence.
- If a slide links to a live page, say on the slide what will open.
