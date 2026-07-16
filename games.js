// Catalog wrapper: load the preserved game list, then hide removed titles.
document.write('<script src="./games-source.js"><\/script>');
document.write('<script>(function(){const removed=new Set(["play-and-score.html","flavor-flux.html","call-the-card.html","suit-sync.html","turn-of-the-wild.html"]);window.K2_GAMES=(window.K2_GAMES||[]).filter(g=>!removed.has(g.f));})();<\/script>');
