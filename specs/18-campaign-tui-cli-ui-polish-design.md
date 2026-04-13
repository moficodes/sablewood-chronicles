# Campaign TUI CLI - Full Screen & Rich Details Design

## Overview
This design covers the first sub-project of the TUI enhancement requests: UI Polishing. The goals are to make the TUI occupy the full terminal window via the alternate screen buffer, and to display all YAML properties of an item inside a scrollable details pane.

## 1. Full Screen Mode
To make Ink act as a true full-screen application (like `vim` or `htop`):
- We will modify `cli/index.tsx` to clear the screen and potentially enter the alternate screen buffer (`\x1b[?1049h`).
- Ink has a built-in `fullscreen` option in its render config: `render(<App />, { exitOnCtrlC: false })` combined with wrapping the top level component. However, the most reliable cross-platform Ink way is to use a custom hook to read `process.stdout.columns` and `process.stdout.rows` and set the root `<Box>` strictly to `width={columns}` and `height={rows}`.
- This will lock the footer to the bottom of the terminal and allow the inner flex boxes to properly consume the available height.

## 2. Rich Data Components
The models in `cli/components.tsx` will be fully expanded to display all data defined in `data/campaign.yml`.
- **Players:** Will include `backstory`, `stats` mapping, `backgroundQuestions` list, and `connectionQuestions` list.
- **NPCs:** Will include the `memorableInteractions` array.
- **Locations:** Will include the `memorableInteractions` array.
- **Timeline:** Will include the `pcNotes` array.

## 3. Custom Scrolling View
Since Ink does not have a native scrolling text area component, we will implement a custom `ScrollView` component.
- The `ScrollView` will take the raw structured data (or pre-rendered React nodes), and a known inner height.
- It will use `useInput` to listen for `[Up]` and `[Down]` arrows.
- It will slice the content array based on a calculated `offset` to simulate scrolling, rendering only the lines that fit within the available window height. 
- *Note:* Implementing accurate scrolling in Ink can be tricky if using flexbox, so we will likely slice an array of string lines or uniformly sized React nodes.

## Exclusions
Form editing and data addition wizards are strictly excluded from this design and will be handled in separate future phases.