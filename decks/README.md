# Decks

Two PowerPoint decks that follow the process on the site, in its design: the
near-black canvas, Inter, hairlines instead of boxes, the `*>` mark and the cube
figures. Both hold worked example content for a fictional Eksempel AS. Each
slide's speaker notes say what to replace and why the slide is there.

- `INIT-forslag.pptx` — the proposal sent after the first call (step 02 on the
  site): the problem as understood, the improvement, scope, the one measure,
  plan with dates, price, next step.
- `INIT-overlevering.pptx` — the handover walkthrough (step 04): what was
  delivered against the proposal, how it works, the daily routine, the result
  against the measure, ownership and access, the next 14 days.

## Font

The decks are set in Inter, the site's typeface. PowerPoint substitutes another
sans if Inter is not installed, which changes line breaks a little. Inter is
free: https://rsms.me/inter/ — install it on the machine that edits or presents
the decks.

## Regenerating

The decks are built by `build.js` with [pptxgenjs](https://gitbrent.github.io/PptxGenJS/);
every drawing is native PowerPoint geometry, so the files stay editable. To
rebuild after editing the script:

```sh
npm install --no-save pptxgenjs
node decks/build.js decks
```
