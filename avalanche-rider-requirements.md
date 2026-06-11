# Avalanche Rider — 2-Page Game Requirements

## Page 1 — Product Vision, Camera, and Core Game Feel

### Game Summary
Avalanche Rider is a single-page HTML arcade game where the player controls a snowboarder racing downhill while an avalanche pours down the mountain behind them. The game should look like a stylized 3D 8-bit/16-bit pixel-art arcade scene: chunky shapes, blocky shadows, fake depth, and exaggerated visual motion. The goal is simple: survive as long as possible, dodge mountain hazards, use jumps, and keep enough distance from the avalanche wall.

### Target Experience
The game should immediately communicate three things within the first two seconds of play:

1. The snowboarder is moving downhill fast.
2. The camera is above and slightly behind/in front of the rider like a reverse drone chase shot, not flat side-view.
3. The avalanche is visibly chasing from the uphill/back side of the course.

The game should feel frantic but readable. Hazards need to be visible early enough for quick steering decisions. The avalanche should be impossible to miss: a large animated snow wall, rolling chunks, warning tint, screen shake, and a danger line that creeps toward the player over time.

### Camera Requirement
Use a top-down reverse drone angle with fake 3D perspective:

- The course should be drawn as a trapezoid/slope corridor.
- Objects farther uphill should be smaller and closer to the top-center.
- Objects closer to the rider should be larger and wider apart.
- The snowboarder should sit in the lower-middle of the screen so the player can see upcoming obstacles.
- The avalanche should occupy the upper/back portion of the screen and advance toward the rider.
- Snow tracks, slope lines, and object scale must reinforce depth.

### Visual Style
The game should use a chunky pixel-art look without external assets:

- Canvas rendering only.
- No image dependencies.
- Pixelated block rectangles and simple polygon shapes.
- Bright snow, blue shadows, dark pine trees, gray rocks, brown ramps, and red/yellow warning accents.
- Optional scanline/pixel-grid overlay for retro arcade feel.

### Core Loop
The player starts a run, carves left/right to avoid hazards, jumps over obstacles or hits ramps, and survives until a crash or avalanche catch.

Primary actions:

- Move left.
- Move right.
- Jump.
- Hit ramps for bonus air and score.
- Pass flags/gates for bonus points.

Fail states:

- Hit a tree.
- Hit a rock while not airborne.
- Get caught by the avalanche wall.

### Controls
Desktop:

- Left: ArrowLeft or A.
- Right: ArrowRight or D.
- Jump: Space, W, or ArrowUp.

Mobile:

- On-screen left/right buttons.
- On-screen jump button.
- Optional drag steering on the canvas.

Controls must be responsive and usable on iPhone Safari. Buttons should be large enough for thumbs and must not trigger page scrolling.

---

## Page 2 — Gameplay Systems, UI, and Acceptance Criteria

### Course Objects
The course should include multiple obstacle and bonus types:

| Object | Behavior | Collision |
|---|---|---|
| Tree | Dangerous fixed hazard | Crash unless avoided |
| Rock | Dangerous low obstacle | Crash unless jumping |
| Jump/Ramp | Launches rider into air | Safe, gives bonus |
| Gate/Flag | Bonus scoring object | Safe, gives distance/score |
| Snow chunks | Avalanche decoration/danger feel | Mostly visual unless near wall |

Objects should spawn with lane variation and perspective scale. At the top of the screen they should appear smaller; near the rider they should appear larger.

### Avalanche Behavior
The avalanche is the most important visual improvement.

Requirements:

- It must be visible at the top/uphill side of the screen during gameplay.
- It should be drawn as a moving white wall with animated chunks and mist.
- It should slowly advance toward the rider as the run continues.
- It should pulse, shake the screen, or tint the top of the scene to create danger.
- The player loses if the avalanche boundary reaches the rider.
- The HUD should include a clear avalanche distance/danger meter.

### Scoring and Progression
Scoring should reward distance and risk:

- Distance increases continuously while alive.
- Speed increases gradually over time.
- Ramps and gates give small score boosts.
- Best distance should save in localStorage.

Difficulty should scale with:

- Faster slope scrolling.
- More frequent obstacles.
- Avalanche advancing closer.
- More screen shake or weather intensity.

### UI/HUD
The HUD should remain readable without blocking the action:

- Distance.
- Speed multiplier.
- Best distance.
- Avalanche gap or danger indicator.

Start overlay should explain the premise and controls. Game-over overlay should show final distance and restart button.

### Technical Requirements
The app must remain a single-file SPA HTML game:

- One HTML file.
- Embedded CSS.
- Embedded JavaScript.
- Canvas-based rendering.
- No package manager.
- No build step.
- No external images, fonts, or libraries.
- Mobile Safari friendly.
- Works from GitHub Pages/static hosting.

### Acceptance Criteria
The refactor is successful when:

1. The avalanche is clearly visible during active gameplay.
2. The avalanche appears behind/uphill from the rider, not as snow under the rider.
3. The camera feels angled with fake depth through scaling, slope lines, and perspective road shape.
4. Trees, rocks, jumps, and gates are readable and feel like they occupy the course.
5. The snowboarder feels like they are riding downhill at speed.
6. The game can be played on desktop and mobile.
7. The index page links to the updated game.
8. No external assets are required.
