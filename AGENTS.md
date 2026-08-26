# K2 Games repository rules

## Adding or editing games

Every playable standalone game lives as a root-level `*.html` file.

When a task adds, renames, deletes, or edits a game HTML file, the task is NOT complete until the generated home-screen catalog is regenerated and validated.

Required completion steps:

1. Create or update the root-level game HTML file.
2. Give the game a meaningful HTML `<title>`.
3. Run `python3 _generate_games_data.py` from the repository root.
4. Include the resulting `games.js` change in the same commit/PR whenever possible.
5. Run `node --check games.js`.
6. Verify every active root-level HTML game appears exactly once in `games.js`.

Do not manually add individual game cards to `index.html`.
Do not maintain a second hard-coded game list.
Do not rely on browser-side GitHub API discovery for normal launcher population.

`games.js` is generated from the repository HTML files and supplies the launcher with:

- filename
- app/game title
- emoji/icon
- created date
- last-updated date
- classic-game flag

The launcher must preserve search by title/filename/emoji, emoji filters, favorites, random game selection, and sorting by recently updated, newest created, and title.

The GitHub Actions catalog workflow is a safety net; generation should still be part of the same change that adds or edits a game.
