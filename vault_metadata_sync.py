import os
import json
import re
from datetime import datetime

# Comprehensive emoji mapping system
EMOJI_MAP = {
    # Sports & Competition
    'hoops': '🏀', 'basketball': '🏀', 'dunk': '🏀', 'number-trap': '🪤', 'nashball': '🏀',
    'soccer': '⚽', 'shootout': '⚽', 'Retro Goal': '⚽',
    'football': '🏈', 'gridiron': '🏈', 'fieldgoal': '🏈',
    'hockey': '🏒', 'airhockey': '🏒',
    'volleyball': '🏐',
    'baseball': '⚾', 'hr-derby': '⚾', 'duel-at-the-plate': '⚾', 'hits-and-outs': '⚾',
    'ping-pong': '🏓', 'tennis': '🎾',
    'billiards': '🎱', 'pool': '🎱', 'skeeball': '🎱',
    'golf': '⛳', 'minigolf': '⛳', 'fairway': '⛳',
    'bowling': '🎳', 'turkey-time': '🎳',
    'archery': '🏹', 'javelin': '🔱',
    'swim': '🏊', 'diving': '🏊‍♂️',
    'slalom': '🎿', 'downhill': '⛷️', 'bobsled': '🛷', 'curling': '🥌', 'sled': '🛷',
    'bmx': '🚲', 'biker': '🏍️', 'surfing': '🏄‍♂️', 'bocce': '🔵',
    'racing': '🏎️', 'go-fast': '🏎️', 'gta': '🚕', 'subway': '🚇',
    'checkers': '🏁', 'chess': '♟️', 'tic-tac-toe': '❌', '2048': '🔢',
    
    # Space & Flight
    'space': '🚀', 'lander': '🚀', 'galaxy': '🚀', 'jetpack': '🎒', 'sky-voyager': '🎈',
    'drone': '🚁', 'medevac': '🚁', 'parachute': '🪂', 'planes': '✈️',
    
    # Animals & Monsters
    'bird': '🐦', 'flappy': '🐦', 'sling': '🐦',
    'duck': '🦆', 'frogger': '🐸', 'kitten': '🐱', 'minion': '🍌',
    'monster': '🦖', 'rampage': '🦖', 'kaiju': '🦖', 'shark': '🦈',
    'dog': '🐕', 'mushing': '🐕', 'fairy': '🧚', 'donkey': '🦍',
    
    # Food & Lifestyle
    'chef': '🍔', 'kitchen': '🍳', 'burger': '🍔', 'pizza': '🍕', 'cookie': '🍪', 
    'sushi': '🍣', 'fruit': '🍉', 'slice': '🍉', 'beer-pong': '🍺',
    
    # Puzzles & Logic
    'puzzle': '🧩', 'rush-hour': '🚦', 'maze': '🏛️', 'cubesolver': '🧱',
    'blueprint': '📐', 'maker': '🏗️', 'circuit': '🔌', 'magnet': '🧲',
    'wordle': '🔡', 'mad-lips': '👄', 'hangman': '😵', 'sequence': '🔢',
    'minesweeper': '💣', 'exploding': '💣', 'tower-defense': '🛡️',
    'scrub': '🧼', 'scavenger': '🔍',
    
    # Mystery & Science
    'lacuna': '🧬', 'inception': '🌀', 'timeline': '⏳', 'illusion': '👁️', 
    'memory': '🧠', 'memoarrr': '🃏', 'relics': '🗿', 'zen': '🎍',
    
    # Action & Misc
    'war': '⚔️', 'quest': '⚔️', 'fists': '👊', 'paint-wars': '🎨', 
    'laser': '🔦', 'deflector': '🔦', 'claw': '🏗️', 'crane': '🏗️',
    'tetris': '🧱', 'tower': '🏢', 'minecraft': '⛏️', 'digdug': '⛏️',
    'oregon': '🗺️', 'explore': '🗺️', 'gps': '🗺️', 'road-trip': '🛣️',
    'station-19': '🚒', 'life': '🚶', 'shopping': '🛒', 'push': '🔘',
    'bubble': '🍼', 'pop': '🎈', 'boomerang': '🪃', 'helmet': '🪖', 
    'lumber': '🪓', 'rock': '🪨', 'grow': '🌱', 'dots-and-boxes': '🎲',
    'uno': '🃏', 'cards': '🃏', 'dice': '🎲', 'yahtzee': '🎲', 'slots': '🎰', 'roulette': '🎰',
    'shutthebox': '📦', 'plinko': '⚪', 'racko': '🗂️'
}

def get_metadata():
    # Use the output from the previous turn (simulated here)
    # In a real scenario, I'd read the JSON file or re-run the command
    # For this script, I'll rely on the user's provided list and OS stats
    games_list = []
    files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html']
    
    for filename in files:
        stats = os.stat(filename)
        # Format dates as ISO-ish strings YYYY-MM-DDTHH:MM
        created = datetime.fromtimestamp(stats.st_ctime).strftime('%Y-%m-%dT%H:%M')
        updated = datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%dT%H:%M')
        
        # Determine Title
        base = filename.replace('.html', '')
        title = base.replace('-', ' ').title()
        
        # Override specific titles
        overrides = {'Gta': 'GTA Retro', '2048': '2048', 'Hr Derby': 'HR Derby Pro', 'Nashball': 'Nashball Elite'}
        title = overrides.get(title, title)
        
        # Determine Emoji
        emoji = '🎮'
        low_base = filename.lower()
        for key, e in EMOJI_MAP.items():
            if key in low_base:
                emoji = e
                break
                
        games_list.append({
            'f': filename,
            't': title,
            'i': emoji,
            'c': created,
            'u': updated
        })
    
    # Sort by created date descending
    games_list.sort(key=lambda x: x['c'], reverse=True)
    return games_list

def update_index():
    games = get_metadata()
    
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Build the new games array string
    games_js = "        const games = [\n"
    for i, g in enumerate(games):
        comma = "," if i < len(games) - 1 else ""
        games_js += f"            {{ f: '{g['f']}', t: '{g['t']}', i: '{g['i']}', c: '{g['c']}', u: '{g['u']}' }}{comma}\n"
    games_js += "        ];"
    
    # Replace using regex
    new_content = re.sub(r'const games = \[.*?\];', games_js, content, flags=re.DOTALL)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Synchronized {len(games)} games with unique emojis and filesystem timestamps.")

if __name__ == "__main__":
    update_index()
