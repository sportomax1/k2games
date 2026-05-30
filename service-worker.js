/*
 * K2 Games PWA Service Worker
 *
 * When you add or change games/assets:
 * 1) Update CACHE_NAME (for example, k2-games-v2).
 * 2) Keep GAME_HTML_FILES and LOCAL_ASSET_FILES in sync with new files.
 * 3) Commit and deploy; clients will refresh cache on next load.
 */

var CACHE_NAME = 'k2-games-v7';
var CORE_ASSETS = [
  './',
  './index.html'
];

var GAME_HTML_FILES = [
  './2048.html',
  './8bit-garden.html',
  './adventure-quest.html',
  './airhockey.html',
  './arctic-expedition.html',
  './backgammon.html',
  './banana-bounce.html',
  './banana-dash.html',
  './beer-pong.html',
  './belly-bump-bash.html',
  './biker-beast.html',
  './billiards.html',
  './blackjack.html',
  './blitz-rampage.html',
  './block-builder.html',
  './block-drop.html',
  './block-world.html',
  './blueprint-builder.html',
  './bmx-racing.html',
  './bobsled.html',
  './bocce-ball.html',
  './boomerang-boss.html',
  './brain-freeze.html',
  './brick-breaker.html',
  './bubble-block.html',
  './bubble-pop.html',
  './calendar-puzzle.html',
  './call-the-card.html',
  './canopy-banana-blitz.html',
  './cant-stop.html',
  './canyonlands-drift.html',
  './capturetheflag.html',
  './card-match.html',
  './charge.html',
  './checkers.html',
  './chef-kitchen.html',
  './chess.html',
  './choose-your-adventure.html',
  './circuit-breaker.html',
  './city-tycoon.html',
  './claim-the-gardens.html',
  './claim-the-set.html',
  './claw-machine.html',
  './coin-jumper.html',
  './collectors-choice.html',
  './color-climb.html',
  './color-road.html',
  './commander-clash.html',
  './connect-6.html',
  './cookie-monster.html',
  './corn-maze-escape.html',
  './countdown-catch.html',
  './craps.html',
  './crazy-kitchen.html',
  './critter-clicker.html',
  './critter-creek.html',
  './critter-maze.html',
  './crossing-guard.html',
  './crossword.html',
  './cruise-control.html',
  './crypto-tycoon.html',
  './cubesolver.html',
  './cul-de-sac-sluggers.html',
  './cup-stacking.html',
  './curling.html',
  './darts.html',
  './dino-cart.html',
  './deep-sea-salvage.html',
  './descent-dash.html',
  './dice-fortune.html',
  './dicefootball.html',
  './disc-golf.html',
  './diving-board.html',
  './dj-mix-master.html',
  './docking-days.html',
  './dodgeball.html',
  './dog-mushing.html',
  './dots-and-boxes.html',
  './downhill.html',
  './dragonspire.html',
  './drone-delivery.html',
  './duel-at-the-plate.html',
  './dungeon-ironfang.html',
  './echo-lights.html',
  './eggscape-runner.html',
  './emoji-explorer.html',
  './emoji-recall.html',
  './explore-life.html',
  './feather-fling.html',
  './fetch-frenzy.html',
  './fieldgoal.html',
  './fists.html',
  './fixed-fate.html',
  './flavor-flux.html',
  './fleet-strike.html',
  './flight-controller.html',
  './foursquare.html',
  './frontier-journey.html',
  './fruit-slice.html',
  './galaxy-glider.html',
  './ghostcatcher.html',
  './giant-smash.html',
  './go-fast.html',
  './golf.html',
  './gone-wild.html',
  './gridiron-glory.html',
  './grow.html',
  './half-court-hoops.html',
  './halfpipe.html',
  './harvest-hustle.html',
  './hero-helper.html',
  './helmetshuffle.html',
  './hits-and-outs.html',
  './hive-hustle.html',
  './hockey.html',
  './home-run-derby.html',
  './hoops.html',
  './hop-quest.html',
  './horse-racing.html',
  './hurdle.html',
  './hydro-flow.html',
  './impulse-override.html',
  './inception.html',
  './index.html',
  './island-quest.html',
  './javelin.html',
  './jet-ski.html',
  './jetpack.html',
  './jungle-swing.html',
  './juggling.html',
  './kombat-arena.html',
  './jump-junkie.html',
  './key-crusher.html',
  './keyfly.html',
  './lake-powell-slot-canyon.html',
  './laser-chase.html',
  './laser-deflector.html',
  './leash-and-lanes.html',
  './letter-lock.html',
  './life-tycoon.html',
  './life.html',
  './log-rolling.html',
  './loopblade-brawl.html',
  './love-shot.html',
  './lumber-jack.html',
  './mad-lips.html',
  './magnet-master.html',
  './mahjong.html',
  './maker-grid.html',
  './mallard-mayhem-3d.html',
  './marble-race.html',
  './maze-runner.html',
  './medevac-rescue.html',
  './memory.html',
  './mexican-train.html',
  './midnight-heist.html',
  './minefield-mapper.html',
  './minigolf.html',
  './monster-rampage.html',
  './moon-lander.html',
  './mouse-heist-home.html',
  './nashball.html',
  './neck-stretch.html',
  './number-ninja.html',
  './number-trap.html',
  './open-world-3d.html',
  './orbit-odyssey.html',
  './order-quest.html',
  './overtime-er.html',
  './pack-attack.html',
  './paddle-clash.html',
  './paint-wars.html',
  './pair-and-conquer.html',
  './pandadice.html',
  './paperboy-8bit.html',
  './parachute-jumper.html',
  './parking-lot-boss.html',
  './paintball-arena.html',
  './pattern-pals.html',
  './peg-drop.html',
  './pinball.html',
  './ping-pong.html',
  './pizzarush.html',
  './play-and-score.html',
  './playfootball.html',
  './proximity-riddles.html',
  './push.html',
  './quack-quest.html',
  './qwingo.html',
  './rack-run.html',
  './rail-forge.html',
  './real-life.html',
  './redlightgreenlight.html',
  './relics.html',
  './restaurant-tycoon.html',
  './reversi.html',
  './rig-master-articulated-precision.html',
  './rim-rush-dunk.html',
  './risk-roller.html',
  './river-run.html',
  './road-trip.html',
  './rock-paper-scissors.html',
  './rock-skip.html',
  './roller-alley.html',
  './roller-coaster.html',
  './rooftop-rumble.html',
  './room-rush.html',
  './roulette.html',
  './route-masters.html',
  './rush-hour.html',
  './scavenger-hunt.html',
  './scrub-master.html',
  './scrub-squad.html',
  './seat-sense.html',
  './seeker-quest.html',
  './sequence-guess.html',
  './shark-raid.html',
  './sheepdog-summit-3d.html',
  './shootout.html',
  './shopping-cart.html',
  './shuffleboard.html',
  './shutthebox.html',
  './sidewalk.html',
  './sinkhole.html',
  './sizzle-shift.html',
  './ski-jumping.html',
  './sky-courier.html',
  './sky-voyager.html',
  './skybreaker-battalion.html',
  './skypark-symphony.html',
  './slalom.html',
  './slam-dunk-8bit.html',
  './sled-rider.html',
  './slide-dive.html',
  './sliding-puzzle.html',
  './slots.html',
  './snake.html',
  './snowball-fight.html',
  './soccer-8bit.html',
  './space-debris.html',
  './space-shooter.html',
  './station-19.html',
  './stealth-shadows.html',
  './stride-surge.html',
  './street-chaos.html',
  './street-guess.html',
  './subway-jumper.html',
  './sudoku.html',
  './super-smash-brawl.html',
  './suit-sync.html',
  './surfing.html',
  './sweet-match.html',
  './swim-race.html',
  './swipe-and-sort.html',
  './switchyard-sentinel.html',
  './three-steps-ahead.html',
  './tic-tac-toe.html',
  './tile-tapper.html',
  './timeline.html',
  './tower-defense-core.html',
  './traffic-control.html',
  './trail-tracker.html',
  './trampoline.html',
  './tunnel-miner.html',
  './turkey-time.html',
  './turn-of-the-wild.html',
  './twin-scenes.html',
  './twister-titan.html',
  './vector-claim.html',
  './void-escape.html',
  './volleyball.html',
  './war.html',
  './wave-ripper.html',
  './wind-sail.html',
  './word-master.html',
  './word-search.html',
  './worm-trail.html',
  './would-you-rather.html',
  './zen-garden.html'
];

var LOCAL_ASSET_FILES = [
  './puzzles.js',
  './football-mobile.png',
  './football-desktop.png',
  './cul-de-sac-sluggers-mobile.png',
  './cul-de-sac-sluggers-desktop.png',
  './manifest.json'
];

function dedupe(items) {
  var seen = {};
  var out = [];
  var i;
  for (i = 0; i < items.length; i++) {
    if (!seen[items[i]]) {
      seen[items[i]] = true;
      out.push(items[i]);
    }
  }
  return out;
}

var PRECACHE_URLS = dedupe(CORE_ASSETS.concat(GAME_HTML_FILES, LOCAL_ASSET_FILES));

function notifyClients(message) {
  return self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        return self.skipWaiting();
      })
      .then(function () {
        return notifyClients({ type: 'PRECACHE_COMPLETE' });
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      return notifyClients({ type: 'PRECACHE_COMPLETE' });
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  var request = event.request;

  event.respondWith(
    caches.match(request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(function (networkResponse) {
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          if (request.url.indexOf(self.location.origin) === 0) {
            cache.put(request, responseToCache);
          }
        });
        return networkResponse;
      }).catch(function () {
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
