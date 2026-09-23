(() => {
  const enhance = () => {
    const drop = document.querySelector('#drop');
    const controls = document.querySelector('.controls');
    if (!drop || !controls) return;
    const style = document.createElement('style');
    style.textContent = `
      .controls { filter: drop-shadow(0 0 18px rgba(239,195,101,.16)); }
      .drop { position:relative; overflow:hidden; transition:transform .16s ease, box-shadow .22s ease, filter .22s ease; }
      .drop::after { content:""; position:absolute; inset:-70% -25%; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.5),transparent 60%); transform:translateX(-120%) rotate(8deg); animation:stoneShine 3.8s ease-in-out infinite; }
      .drop.pressed { filter:brightness(1.12); box-shadow:0 0 0 7px rgba(239,195,101,.16),0 14px 32px #0009; }
      @keyframes stoneShine { 0%,58% { transform:translateX(-120%) rotate(8deg) } 80%,100% { transform:translateX(135%) rotate(8deg) } }
    `;
    document.head.append(style);
    const pulse = () => { drop.classList.remove('pressed'); void drop.offsetWidth; drop.classList.add('pressed'); setTimeout(()=>drop.classList.remove('pressed'),180); };
    drop.addEventListener('click', pulse);
    drop.addEventListener('keydown', event => { if (event.code === 'Space' || event.key === 'Enter') pulse(); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance); else enhance();
})();
