import re
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent

# These are intentionally retired/merged pages and should not appear in the launcher.
EXCLUDED_FILES = {
    "index.html",
    "back-it-up.html",
    "rig-master-articulated-precision.html",
}

icon_rules = [
    (re.compile(r"tool|repair|fix|scrub|clean|mower", re.I), "🛠️"),
    (re.compile(r"hog|pig", re.I), "🐷"),
    (re.compile(r"lasso|frontier|cowboy|bull|rodeo", re.I), "🤠"),
    (re.compile(r"truck|parking|back[- ]?it[- ]?up|rig|road|drive|traffic|street|route|subway|train|rail|bus|taxi|delivery|courier", re.I), "🚚"),
    (re.compile(r"rail|train|switchyard|station", re.I), "🚂"),
    (re.compile(r"basket|hoops|dunk|rim|court|nashball|half[- ]?court", re.I), "🏀"),
    (re.compile(r"baseball|slugger|home[- ]?run|hits?[- ]?and[- ]?outs|duel[- ]?at[- ]?the[- ]?plate", re.I), "⚾"),
    (re.compile(r"football|gridiron|fieldgoal|touchdown", re.I), "🏈"),
    (re.compile(r"soccer|striker|shootout", re.I), "⚽"),
    (re.compile(r"hockey|airhockey", re.I), "🏒"),
    (re.compile(r"golf|billiards|pool|bocce|darts|curling|bowling|shuffleboard|skee[- ]?ball|beer[- ]?pong|ping[- ]?pong|tennis|volleyball|badminton|racquet|paddle", re.I), "🏆"),
    (re.compile(r"ski|snow|sled|slalom|downhill|avalanche|arctic|bobsled|halfpipe|powder|snowball", re.I), "🏂"),
    (re.compile(r"surf|swim|dive|diving|hydro|water|wave|river|lake|sea|salvage|log[- ]?rolling|jet[- ]?ski|slalom|sail|wind", re.I), "🌊"),
    (re.compile(r"bmx|bike|biker|race|racing|derby|drift|formula|nitro|runner|run|sprint|hurdle|javelin|track|jump|trampoline|skate|marble", re.I), "🏆"),
    (re.compile(r"drone|jetpack|plane|planes|launch|glider|glide|hover|flight|fly|sky|parachute|air", re.I), "🛩️"),
    (re.compile(r"2048\b|number|sudoku|puzzle|maze|crossword|word|letter|hangman|sequence|pattern|memory|match|slide|tile|grid|logic|riddle|rubik|cube|minesweeper|connect|dots|box", re.I), "🧩"),
    (re.compile(r"dragon|dungeon|quest|adventure|hero|battle|brawl|combat|war|risk|relic|stealth|clash|duel|ironfang|boss|raid|defender|sentinel|monster|spell|magic|fate|kombat|fist|boxing|paint[- ]?wars|capture[- ]?the[- ]?flag|heist|laser|ghost|shark|smash|rampage|blitz", re.I), "⚔️"),
    (re.compile(r"farm|garden|harvest|tree|leaf|flora|nature|jungle|forest|island|beach|canopy|canyon|desert|valley|mountain|expedition|wild|zoo|animal|critter|sheep|cow|duck|mallard|panda|turtle|dog|cat|mouse|frog|bird|snake|fox|wolf|bear|rabbit|giraffe|rhino|donkey|worm|centipede|fetch|leash|lumberjack", re.I), "🌿"),
    (re.compile(r"space|orbit|galaxy|star|moon|solar|planet|astro|cosmic|alien|spacecraft|rocket|satellite|meteor|nebula|quantum|asteroids|lunar", re.I), "🚀"),
    (re.compile(r"card|blackjack|poker|slots|roulette|craps|dice|mahjong|reversi|checkers|chess|backgammon|shutthebox|claim|tiles?|yahtzee|domino|rack[- ]?o|call[- ]?the[- ]?card|push|suit|qwingo", re.I), "🃏"),
    (re.compile(r"cook|kitchen|pizza|burger|food|fruit|banana|tomato|cookie|chef|baker|sizzle|flavor|grill|eat|restaurant|seat", re.I), "🍔"),
    (re.compile(r"city|town|control|tycoon|builder|tower|castle|bridge|house|home|shop|mall|market|real[- ]?life|life[- ]?sim|room", re.I), "🏙️"),
    (re.compile(r"music|mix|drum|beat|dj|piano|guitar|song|audio|sound|symphony", re.I), "🎵"),
    (re.compile(r"claw|coin|cash|bank|crypto|money|treasure|loot|gem|diamond|gold|collector", re.I), "💰"),
    (re.compile(r"art|paint|draw|color|pixel|blueprint|gallery|studio|design|illusion", re.I), "🎨"),
    (re.compile(r"emoji|would[- ]?you[- ]?rather|mad[- ]?lips|timeline|inception|impulse|three[- ]?steps|swipe|sort|play[- ]?and[- ]?score|pair[- ]?and[- ]?conquer|red[- ]?light|green[- ]?light|simon|echo", re.I), "🎲"),
]

classic_rules = re.compile(
    r"(classic|retro|8-bit|8bit|mahjong|checkers|chess|2048|tic tac toe|tictactoe|snake|slots|blackjack|golf|war|reversi|memory|word search|crossword|fixed fate|turn of the wild|route masters|pack attack|word master|sudoku|shutthebox|backgammon|life|hoops|foursquare|fruit slice|football|hockey|pong)",
    re.I,
)


def parse_existing_catalog(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}

    source = path.read_text(encoding="utf-8", errors="ignore")
    found: dict[str, dict] = {}
    patterns = [
        re.compile(
            r"\{\s*f:\s*'([^']+)'\s*,\s*t:\s*'((?:\\'|[^'])*)'\s*,\s*i:\s*'([^']+)'\s*,\s*c:\s*'([^']+)'\s*,\s*u:\s*'([^']+)'\s*,\s*cl:\s*(true|false)\s*\}"
        ),
        re.compile(
            r'\{\s*f:\s*"([^"]+)"\s*,\s*t:\s*"((?:\\"|[^"])*)"\s*,\s*i:\s*"([^"]+)"\s*,\s*c:\s*"([^"]+)"\s*,\s*u:\s*"([^"]+)"\s*,\s*cl:\s*(true|false)\s*\}'
        ),
    ]
    for pattern in patterns:
        for item in pattern.finditer(source):
            found[item.group(1)] = {
                "t": item.group(2).replace("\\'", "'").replace('\\"', '"'),
                "i": item.group(3),
                "c": item.group(4),
                "u": item.group(5),
                "cl": item.group(6) == "true",
            }
    return found


def strip_title(title: str) -> str:
    title = title.strip()
    title = re.sub(r"\s*[-|—]\s*K2 Games?$", "", title, flags=re.I)
    return title.strip()


def title_from_file(path: Path, fallback: str | None = None) -> str:
    if fallback:
        return fallback
    text = path.read_text(encoding="utf-8", errors="ignore")
    match = re.search(r"<title>([^<]+)</title>", text, re.I)
    return strip_title(match.group(1)) if match else path.stem.replace("-", " ").title()


def icon_for(title: str, filename: str) -> str:
    text = f"{title} {filename}"
    for pattern, icon in icon_rules:
        if pattern.search(text):
            return icon
    return "🎮"


def git_date(file_path: Path, first: bool) -> str:
    command = ["git", "log", "--follow", "--reverse", "--format=%aI", "--", file_path.name] if first else ["git", "log", "-1", "--format=%aI", "--", file_path.name]
    result = subprocess.run(command, cwd=root, capture_output=True, text=True, check=False)
    dates = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    return dates[0] if dates else "1970-01-01T00:00:00Z"


# Preserve curated titles/icons/dates from the old full catalog, then apply newer
# additions from games.js over the top.
overrides: dict[str, dict] = {}
overrides.update(parse_existing_catalog(root / "games-source.js"))
overrides.update(parse_existing_catalog(root / "games.js"))

files = sorted(
    [path for path in root.glob("*.html") if path.name not in EXCLUDED_FILES],
    key=lambda path: path.name.lower(),
)

entries = []
for path in files:
    existing = overrides.get(path.name)
    title = title_from_file(path, existing["t"] if existing else None)
    created = existing["c"] if existing else git_date(path, True)
    updated = existing["u"] if existing else git_date(path, False)
    icon = existing["i"] if existing else icon_for(title, path.name)
    classic = existing["cl"] if existing else bool(classic_rules.search(f"{title} {path.stem}"))
    entries.append((path.name, title, icon, created, updated, classic))

entries.sort(key=lambda item: (item[4], item[1]), reverse=True)

lines = [
    "// AUTO-GENERATED by _generate_games_data.py.",
    "// Edit an HTML <title> or the generator rules, then regenerate this file.",
    "window.K2_GAMES = [",
]
for filename, title, icon, created, updated, classic in entries:
    safe_title = title.replace("\\", "\\\\").replace("'", "\\'")
    lines.append(
        f"  {{ f: '{filename}', t: '{safe_title}', i: '{icon}', c: '{created}', u: '{updated}', cl: {str(classic).lower()} }},"
    )
lines.append("];" )

(root / "games.js").write_text("\n".join(lines) + "\n", encoding="utf-8")

legacy_catalog = root / "games-source.js"
if legacy_catalog.exists():
    legacy_catalog.unlink()

print(f"Wrote games.js with {len(entries)} entries; one catalog file remains.")
