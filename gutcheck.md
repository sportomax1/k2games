# 🩺 K2 Games: Gutcheck Reference

This file contains specific audit prompts to be used only when requested. These prompts ensure the codebase maintains high standards for cross-platform playability and innovation.

---

### 📱 1. Visual & Real-Estate Audit
**Goal:** Verify that the app utilizes screen space efficiently across different device types.
*   **Mobile (iPhone):** Does the UI utilize modals, slide-outs, or toggle buttons to hide secondary info? Is the core gameplay area maximized?
*   **Desktop:** Does the UI transition to a "flat" layout where secondary info is visible without extra clicks?
*   **Aesthetic:** Does the game feel like a "native app" on phone and a "pro site" on desktop?

### 🎮 2. Control Schema Audit
**Goal:** Ensure the game is playable regardless of the input device.
*   **Touch:** Are there on-screen D-pads, buttons, or gesture support (flicks/swipes)?
*   **Keyboard:** Are standard WASD/Arrows and Space/Enter mappings implemented?
*   **Gamepad (PS5/Xbox):** Are there event listeners for `gamepadconnected` and standard button mappings?
*   **Contextual UI:** Does the game hide on-screen buttons when a keyboard or controller is detected?

### 💡 3. Innovation & Expansion (recs.md)
**Goal:** Generate growth ideas and specific refinements. When this gutcheck is called:
1.  Analyze all current `.html` files in the directory.
2.  Propose **10 NEW App/Game ideas** that fit the K2 Games aesthetic (Single-page HTML/JS).
3.  Propose **3 Specific Feature Updates** per existing game file to improve depth or polish.
4.  **Action:** Save all 10 new ideas and all per-file updates into a new `recs.md` file (overwriting the previous version).

---
*Note: Do not execute these checks automatically. Only run when the user explicitly asks for a "Gutcheck" or "Recommendations".*
