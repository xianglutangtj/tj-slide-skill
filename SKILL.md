---
name: tj-slide-skill
description: Use when making or revising a short HTML slide deck for a talk, lab meeting, project update, or briefing — especially when a draft has too many slides, too many words per slide, tables where a process should be, or content that should appear click by click as the speaker talks.
---

# TJ Slide Skill

Short HTML decks that a speaker talks through: few slides, few words, one idea per click.

## Core principle

**The speaker carries the detail; the slide carries the shape.** A slide shows what the audience should *see* while they listen: a process, a comparison, a split of work. If a line could be said aloud instead, it goes in the speaker notes.

## Workflow

1. **Ask before building.** Read [references/intake-questions.md](references/intake-questions.md). Ask only what the request and the source material have not already answered, in one message, in plain words.
2. **Write the deck plan** before any HTML: one claim per slide, the visual that carries it, and what each click adds. Template in [references/story-and-copy.md](references/story-and-copy.md). Show the plan to the user when the deck is new or the story has changed.
3. **Build** from `assets/starter/deck.html`. Keep the engine and the system styles; replace the slides. Style rules: [references/visual-style.md](references/visual-style.md). Reveal mechanics and code patterns: [references/motion-and-code.md](references/motion-and-code.md).
4. **Render every click and look at it.** `node scripts/verify_deck.mjs deck.html`, then open the contact sheet. Details and a no-install fallback: [references/qa.md](references/qa.md).
5. **Report** what was checked, what was assumed, and what is still the user's call. Then ask the after-draft questions from the intake file.

## The contract for every slide

| Part | Rule |
|---|---|
| Title | A claim or a question, in a full short sentence. Never a topic label like "Background". |
| Body | One dominant visual. Phrases, not sentences. A sentence stays only when no phrase can carry its meaning. |
| Clicks | Each click adds one unit of meaning, and the words arrive with the shape they explain. |
| After a click | What was just explained either recedes (stays, greyed) or leaves (replaced by the next detail). |
| End of a part | A three-box summary: **what is solid · what is not · so** (what follows for us). |
| Notes | One line per click: what to say, including every number and caveat that is not on the slide. |

## Defaults

| Question | Default |
|---|---|
| How many slides? | As few as the story needs. A 5–10 minute update is usually 3. More than 1 slide per 2 minutes needs a reason. |
| What goes first? | Where we are and why — as a process with its gaps showing, not as a status table. |
| Open issues? | Put them inside one workflow (step → step → check → loop back), not as a list of separate jobs. |
| Next steps? | One card per person, with that person's actions. Things on hold get one line and one reason. |
| Wording? | The words the audience would use. No internal codes, no jargon without a definition, no source labels unless the audience needs them. |
| Repeats? | Each fact appears once in the deck. |
| Other audiences' content? | Remove it. Do not shrink it. |

## Hard rules

- Do not invent or tidy up facts. Counts, names, decisions and wording come from the user's material. A name or term you cannot read with confidence is a question for the user, not a guess.
- Changing how a deck looks must not change what it claims. If a restyle needs a content change, say so separately.
- Colour has a fixed meaning across the whole deck, and the legend is drawn exactly like the thing it explains.
- Nothing on a slide is smaller than 20 px on the 1920 × 1080 canvas, apart from the page number. Body text is 28 px or more.
- A deck is not done until every click state has been rendered and looked at. Passing the script is not looking.
- Do not publish, share or overwrite a deck without the user's say-so. Keep the previous version next to the new one.

## Common mistakes

| Mistake | Fix |
|---|---|
| Ten slides for a five-minute update | Merge slides that answer the same question; delete the ones for another audience. |
| A status table (step / status / owner / what is left) | Draw the process; mark done and skipped boxes; put owners inside the boxes. |
| Everything visible at once | Give each element a click; let finished detail leave or recede. |
| Three saturated focal points | Only the thing being explained is at full colour. |
| Review points and new requests shown as two lists | One loop; tag the new items "New". |
| Paragraph under a diagram | Cut it to a phrase, or move it to the notes. |
| Shrinking type to fit | Cut words, split the click, or move detail to notes. Never go smaller. |
| Explaining how the deck or the analysis was produced | Leave it out unless the audience asked. |
