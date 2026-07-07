(function () {
  const NEW_GAME = { f: 'driving-range-picker.html', t: 'Driving Range Picker', i: '🏆', c: '2026-07-07T08:00:00-04:00', u: '2026-07-07T08:00:00-04:00', cl: false };
  const SNAPSHOT_URL = 'https://raw.githubusercontent.com/sportomax1/k2games/ed971b6539589bf90504826f2d3c3c6b45219c16/games.js';
  let existingGames = [];

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', SNAPSHOT_URL, false);
    xhr.send(null);

    if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
      const sandboxWindow = {};
      new Function('window', xhr.responseText + '\nreturn window.K2_GAMES || [];')(sandboxWindow);
      existingGames = Array.isArray(sandboxWindow.K2_GAMES) ? sandboxWindow.K2_GAMES : [];
    }
  } catch (error) {
    existingGames = [];
  }

  window.K2_GAMES = [
    NEW_GAME,
    ...existingGames.filter(game => game && game.f !== NEW_GAME.f)
  ];
})();
