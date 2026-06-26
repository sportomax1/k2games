'use client';
import { useMemo, useState } from 'react';

type Game = { bggId:string; name:string; year:string; thumbnail:string; myRating:number|null; averageRating:number|null; plays:number|null; statuses:Record<string, boolean> };
type Price = any;
const statusOptions = [
  ['own','Own'], ['wishlist','Wishlist'], ['want','Want'], ['wanttoplay','Want to Play'], ['wanttobuy','Want to Buy'], ['preordered','Preordered'], ['fortrade','For Trade'], ['prevowned','Previously Owned']
];
const money = (n?: number | null, c = 'USD') => n == null ? '' : new Intl.NumberFormat('en-US', { style:'currency', currency:c }).format(n);

export default function Page() {
  const [username, setUsername] = useState('sportomax');
  const [statuses, setStatuses] = useState<Record<string, boolean>>({ own: true });
  const [games, setGames] = useState<Game[]>([]);
  const [prices, setPrices] = useState<Record<string, Price>>({});
  const [q, setQ] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState('');
  const [sort, setSort] = useState<{key:string, dir:1|-1}>({ key: 'name', dir: 1 });

  async function loadCollection() {
    setLoading('Loading collection...');
    const active = Object.keys(statuses).filter(k => statuses[k]);
    const res = await fetch(`/api/collection?username=${encodeURIComponent(username)}&statuses=${active.join(',')}`);
    const data = await res.json();
    setGames(data.games || []);
    setLoading('');
  }
  async function refreshOne(id: string) {
    setLoading(`Pricing ${id}...`);
    const res = await fetch(`/api/prices/${id}`);
    const data = await res.json();
    setPrices(p => ({ ...p, [id]: data }));
    setLoading('');
  }
  async function refreshVisible() {
    const ids = filtered.map(g => g.bggId);
    setLoading(`Pricing ${ids.length} games...`);
    for (let i = 0; i < ids.length; i += 10) {
      const res = await fetch('/api/prices/bulk', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ ids: ids.slice(i, i + 10), limit: 10 }) });
      const data = await res.json();
      setPrices(p => ({ ...p, ...Object.fromEntries((data.results || []).map((x: Price) => [x.bggId, x])) }));
    }
    setLoading('');
  }
  const filtered = useMemo(() => {
    const threshold = Number(maxPrice);
    const rows = games.filter(g => g.name.toLowerCase().includes(q.toLowerCase())).filter(g => {
      if (!threshold) return true;
      const p = prices[g.bggId]?.bestOverall?.price;
      return p != null && p <= threshold;
    });
    const val = (g: Game) => {
      const p = prices[g.bggId];
      switch(sort.key) {
        case 'best': return p?.bestOverall?.price ?? 999999;
        case 'amazon': return p?.amazon?.price ?? 999999;
        case 'vendors': return p?.vendors?.min ?? 999999;
        case 'ebay': return p?.ebay?.min ?? 999999;
        case 'geekmarket': return p?.geekmarket?.min ?? 999999;
        case 'rating': return g.averageRating ?? 0;
        case 'plays': return g.plays ?? 0;
        default: return g.name;
      }
    };
    return rows.sort((a,b) => (val(a) > val(b) ? 1 : -1) * sort.dir);
  }, [games, prices, q, maxPrice, sort]);
  const head = (key:string, label:string) => <th onClick={() => setSort(s => ({ key, dir: s.key === key ? (s.dir * -1 as 1|-1) : 1 }))}>{label}</th>;

  return <main>
    <header><h1>BGG Price Tracker</h1><p>Collection to Amazon + vendors + eBay + GeekMarket. Default user is <b>sportomax</b>.</p></header>
    <section className="controls card">
      <label>BGG username <input value={username} onChange={e => setUsername(e.target.value)} /></label>
      <div className="toggles">{statusOptions.map(([k,l]) => <label key={k}><input type="checkbox" checked={!!statuses[k]} onChange={e => setStatuses(s => ({...s, [k]: e.target.checked}))}/>{l}</label>)}</div>
      <button onClick={loadCollection}>Load Collection</button><button onClick={refreshVisible} disabled={!filtered.length}>Price Visible Games</button>
      <input placeholder="Search game" value={q} onChange={e => setQ(e.target.value)} /><input placeholder="Max best price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
      {loading && <span className="loading">{loading}</span>}
    </section>
    <p className="count">Showing {filtered.length} of {games.length} games. Priced: {Object.keys(prices).length}</p>
    <div className="tablewrap card"><table><thead><tr>{head('name','Game')}{head('rating','Avg')}{head('plays','Plays')}{head('best','Best')}{head('amazon','Amazon')}{head('vendors','Vendors min/avg/max')}{head('ebay','eBay min/avg/max')}{head('geekmarket','GeekMarket min/avg/max')}<th>Actions</th></tr></thead>
      <tbody>{filtered.map(g => { const p = prices[g.bggId]; return <tr key={g.bggId}>
        <td className="game">{g.thumbnail && <img src={g.thumbnail} alt=""/>}<div><a href={`https://boardgamegeek.com/boardgame/${g.bggId}`} target="_blank">{g.name}</a><small>{g.year} · #{g.bggId}</small></div></td>
        <td>{g.averageRating?.toFixed(1) || ''}</td><td>{g.plays ?? ''}</td>
        <td className="best">{p?.bestOverall ? <a href={p.bestOverall.url} target="_blank">{money(p.bestOverall.price, p.bestOverall.currency)}<small>{p.bestOverall.source}</small></a> : ''}</td>
        <td>{p?.amazon?.price ? <a href={p.amazon.url} target="_blank">{money(p.amazon.price, p.amazon.currency)}</a> : ''}</td>
        <td>{p?.vendors ? <Summary s={p.vendors}/> : ''}</td><td>{p?.ebay ? <Summary s={p.ebay}/> : ''}</td><td>{p?.geekmarket ? <Summary s={p.geekmarket}/> : ''}</td>
        <td><button onClick={() => refreshOne(g.bggId)}>Price</button></td>
      </tr>})}</tbody></table></div>
  </main>;
}
function Summary({s}:{s:any}) { return <div className="summary"><b>{money(s.min, s.currency)}</b><span>{money(s.avg, s.currency)} / {money(s.max, s.currency)}</span><small>{s.count || 0} rows {s.cheapestLabel ? `· ${s.cheapestLabel}` : ''}</small></div> }
