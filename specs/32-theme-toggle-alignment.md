# 32 Theme Toggle Alignment

## Overview
The dark theme toggle button in the desktop navigation bar is misaligned compared to the navigation text links.

## Current Behavior
The desktop navigation link container uses `items-baseline` for alignment. This works well for text elements but causes buttons containing SVG icons (like the ThemeToggle) to align awkwardly, usually sitting too high or too low compared to the text.

## Proposed Change
Change the alignment class on the desktop menu container in `app/components/navbar.tsx` from `items-baseline` to `items-center` to vertically center both the text links and the theme toggle button along the cross-axis.

- File to edit: `app/components/navbar.tsx`
- Change: `<div className="ml-10 flex items-baseline space-x-4">` -> `<div className="ml-10 flex items-center space-x-4">`