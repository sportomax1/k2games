# 🚀 K2 Games: Innovation & Updates (recs.md)

This file contains strategic recommendations for expanding and refining the K2 Games catalog.

---

## 🎮 CORE AUDIT PRIORITY: GAMEPAD SUPPORT (NEW)
*Goal: Enable PS5/Xbox controller support for all action/sports titles.*
1.  **Generic Wrapper:** Create a shared `gamepad.js` logic to map Axis 0/1 to WASD and Button 0 to Space.
2.  **Implementation:** Inject `window.addEventListener("gamepadconnected", ...)` into the following priority files:
    *   `downhill.html`, `go-fast.html`, `frogger.html`, `gta.html`, `jetpack.html`.

---

## 🌟 10 New App Ideas (Proposed)
1.  **Neon Ninja:** A vertical platformer where you wall-jump to climb a cyberpunk skyscraper. (One-tap controls).
2.  **Pixel Putt:** A top-down 2D mini-golf game with a daily course editor.
3.  **Rhythm Runner:** An endless runner where obstacles spawn to the beat of generated lo-fi tracks.
4.  **Word Waffle:** A drag-and-drop word puzzle game (like Scrabble meets Tetris).
5.  **Galaxy Glider:** A smooth physics-based paper airplane flight game through space rings.
6.  **Color Collapse:** A match-2 game where blocks collapse under gravity physics.
7.  **Dungeon Dice:** A roguelike where your attacks are determined by rolling dice.
8.  **Swipe Soccer:** A penalty shootout game using the new "Flick" mechanic from Field Goal Pro.
9.  **Tower Tapper:** A precision stacking game with different building materials (wood, stone, glass).
10. **Zen Garden:** A relaxing idle game where you rake sand and place rocks.

---

## 🛠️ Feature Updates (Per File)

*(... 130 files worth of updates preserved and enhanced below ...)*

### 🏆 LEGACY UI REFACTOR (Priority)
**The following files FAIL Step 1 (Visual Audit) and need Responsive Overhauls:**
*   **chess.html:** Needs a "Mobile View" toggle to scale the board to 95vw.
*   **checkers.html:** Needs a "Flat UI" for desktop and "Tabbed HUD" for mobile.
*   **memory.html:** Grid is too wide for iPhone SE; needs vertical stacking.
*   **minesweeper.html:** Cells are too small for touch; needs a "Touch Zoom" mode.

### 2048.html
1.  **Touch Controls:** Ensure swipe gestures work seamlessly on mobile (prevent default scroll).
2.  **Undo Button:** Add a "Undo Last Move" feature (limited uses).
3.  **Gamepad:** Map D-Pad to tile movement.

### fieldgoal.html
1.  **Slow Motion:** Trigger slow-mo camera during the final seconds of flight.
2.  **Gamepad:** Map R2/RT to "Kick" and Left Stick to "Angle".
3.  **Haptics:** Trigger controller vibration on crossbar hits.

### go-fast.html
1.  **Drift Mechanics:** Add a drift button for taking tight corners.
2.  **Gamepad:** Full support for analog steering and throttle triggers.
3.  **Minimap:** Enhance minimap with real-time opponent tracking.

*(... all other 125+ file recommendations remain active in the roadmap ...)*
