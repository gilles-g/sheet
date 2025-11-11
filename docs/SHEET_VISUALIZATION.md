# Sheet Visualization Documentation

This document describes the diagrams created to illustrate the superposed sheets functionality.

## Overview

The stimulus-sheet component provides a drawer/sheet interface that slides in from the right side of the screen. The key feature is the ability to stack multiple sheets on top of each other, creating a layered navigation experience.

## Diagrams

### 1. Sheet Animation Sequence

**File:** `docs/images/sheet-animation-sequence.svg`

**Purpose:** Shows the step-by-step animation flow when sheets are opened and stacked.

**Steps Illustrated:**

1. **Base Page**: Shows the initial state with the main content and an "Open Sheet" button
2. **Sheet Slides In**: Demonstrates the sheet sliding in from the right with the overlay appearing
3. **First Sheet Open**: Shows the fully opened sheet with content and an "Open Another Sheet" button
4. **Sheets Stacked**: Displays two sheets stacked on top of each other with layered overlays

**Key Visual Elements:**
- Green arrow indicating the slide-in direction from right
- Overlay with 12% opacity (rgba(0, 0, 0, 0.12))
- Progressive stacking showing depth perception
- Close buttons (red circles with ×)
- Action buttons in blue

### 2. Superposed Sheets Detailed View

**File:** `docs/images/sheets-stacking.svg`

**Purpose:** Provides a comprehensive visual representation of multiple sheets in stacked state.

**Visual Elements:**

- **Base Page**: The underlying page content that becomes obscured by sheets
- **First Sheet (Sheet 1)**: 
  - Slides in from the right
  - Gray background (#f3f3f4)
  - White header with title
  - Contains content and action buttons
  - Adds an overlay to darken the base page
  
- **Second Sheet (Sheet 2)**:
  - Stacks on top of Sheet 1
  - Also slides in from the right
  - Adds another overlay layer
  - Partially covers Sheet 1, showing the stacking effect

**Legend Included:**
- Overlay representation (black with 12% opacity)
- Sheet background color (#f3f3f4)
- Action button styling (blue #007bff)
- Close button (red #dc3545)

## Technical Details

### CSS Properties Illustrated

The diagrams accurately represent the CSS behavior defined in `src/sheet.css`:

- **Z-index**: Sheets use z-index 2002
- **Overlay opacity**: 0.12 (12%) for depth effect
- **Background**: #f3f3f4 for sheet container
- **Shadow effects**: Box shadows on stacked sheets
- **Transform**: Sheets slide using CSS transform: translate()

### Animation Flow

1. Sheet starts off-screen (translated right by viewport width)
2. Overlay fades in to 12% opacity
3. Sheet animates to its final position using CSS transitions
4. Duration: 400ms for smooth animation

## Usage in Documentation

These diagrams are embedded in the README.md file in the "How It Works" section, appearing immediately after the Features list. They help users:

1. **Understand the visual behavior** before implementation
2. **See the stacking mechanism** in action
3. **Learn about the overlay effects** that create depth
4. **Recognize the slide-in animation** pattern

## Color Palette

The diagrams use colors consistent with the component's design:

- **Primary Blue**: #007bff (action buttons)
- **Danger Red**: #dc3545 (close buttons)
- **Success Green**: #28a745 (directional indicators)
- **Gray Background**: #f3f3f4 (sheet background)
- **Light Gray**: #dee2e6 (borders and dividers)
- **Dark Text**: #212529 (headings)
- **Medium Text**: #495057, #6c757d (body text)

## File Formats

Both diagrams are created as SVG (Scalable Vector Graphics) files, which provides:

- **Scalability**: Can be displayed at any size without quality loss
- **Small file size**: Text-based format is efficient
- **Web-friendly**: Native browser support
- **Accessibility**: Can be indexed and read by screen readers
- **Easy editing**: Can be modified with any text editor

## Future Enhancements

Potential additions to the visualization documentation:

1. Animation timing diagrams
2. Responsive behavior illustrations (mobile vs desktop)
3. Interactive demo with click-through states
4. Dark mode variants
5. Accessibility features visualization
