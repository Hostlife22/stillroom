# Accessibility

Stillroom aims to make its controls understandable and usable with different input methods. The cloth scene is a visual WebGL experience, and some interactions still require a pointer. This document describes the current implementation and known gaps; it is not a claim of full accessibility conformance.

## Features currently available

- Native buttons, range inputs, checkboxes, and a select menu for the controls.
- Text labels for settings and accessible names for icon buttons and fabric colors.
- Pressed states for the selected tool and fabric color.
- Visible keyboard focus styles.
- A text description for the interactive scene and status announcements for brief notifications.
- Controls to pause, resume, reset, and add a gust without dragging the fabric.
- A responsive layout for narrow and wide screens.
- Ambient audio that starts only after it is enabled and can be muted.

When `prefers-reduced-motion: reduce` is enabled at page load, the simulation starts paused and CSS transitions are disabled. The preference is read when the app starts; changing it while the page is open requires a reload to update the initial simulation state.

## Keyboard controls

Use **Tab** and **Shift+Tab** to move through controls. Activate buttons using **Enter** or **Space**. Native sliders can be adjusted with the arrow keys while focused.

The app also provides these shortcuts when focus is outside a button, input, or select:

| Key        | Action            |
| ---------- | ----------------- |
| **G**      | Select Grab       |
| **W**      | Select Wind       |
| **C**      | Select Cut        |
| **Space**  | Pause or resume   |
| **R**      | Reset the curtain |
| **Escape** | Close tips        |

Tool shortcuts select a mode; they do not provide keyboard control of individual cloth particles. The **A little gust** button provides a keyboard-accessible way to apply wind. It also resumes the simulation when paused.

## Known limitations

- Grabbing and cutting the fabric require mouse, touch, or another pointer input. There is no keyboard equivalent for selecting and moving particles or tracing cuts.
- A screen reader can identify the scene and controls, but it cannot inspect the cloth geometry or receive a description of each deformation.
- The tips dialog needs focus trapping and reliable restoration of focus after closing. Escape is currently ignored when a button, input, or select has focus, including the dialog's close button. The close button remains available for keyboard activation.
- Several controls and labels are small. Touch target sizes, text contrast, zoom behavior, and screen reader combinations need a dedicated accessibility review.
- The scene requires WebGL and does not currently provide an equivalent experience when rendering is unavailable.

These gaps are useful areas for contributions. Improvements should preserve the ability to pause motion and use settings without interacting directly with the canvas.

## Reporting a barrier

Open an [issue](https://github.com/Hostlife22/stillroom/issues/new) with **Accessibility:** at the beginning of the title. Describe:

- What you were trying to do and what prevented it.
- The browser, operating system, and input method.
- Assistive technology and version, if relevant and you are comfortable sharing it.
- Steps to reproduce and the expected behavior.

You do not need to share personal or medical information. A screenshot or short description of focus movement can help.

## Reviewing changes

For interface contributions, manually check keyboard navigation, visible focus, accessible control names, pause/resume behavior, reduced motion, browser zoom, and narrow layouts. When possible, verify the affected flow with a screen reader. Record the tools used and any remaining gaps in the pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and checks.
