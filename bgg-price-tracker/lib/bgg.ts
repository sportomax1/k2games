export type CollectionStatus = 'own' | 'want' | 'wishlist' | 'wanttoplay' | 'wanttobuy' | 'preordered' | 'fortrade' | 'prevowned';
export type CollectionGame = { bggId: string; name: string; year: string; image: string; thumbnail: string; myRating: number | null; averageRating: number | null; plays: number | null; statuses: Partial<Record<CollectionStatus, boolean>>; };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function textBetween(xml: string, tag: string) { const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)); return m?.[1]?.trim() || ''; }
function attr(xml: string, name: string) { const m = xml.match(new RegExp(`${name}="([^"]*)"`)); return m?.[1] || ''; }
function num(v: string) { const n = Number(v); return Number.isFinite(n) ? n : null; }
export async function fetchBggCollection(username: string, statuses: CollectionStatus[]) {
  const params = new URLSearchParams({ username, stats: '1' });
  for (const s of statuses.length ? statuses : ['own']) params.set(s, '1');
  const url = `https://boardgamegeek.com/xmlapi2/collection?${params}`;
  let xml = '';
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'user-agent': 'k2games-bgg-price-tracker/0.1' }, next: { revalidate: 43200 } });
    xml = await res.text();
    if (!xml.toLowerCase().includes('please try again later')) break;
    await sleep(1500 * (attempt + 1));
  }
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g) || [];
  const games: CollectionGame[] = itemMatches.map((item) => {
    const statusXml = item.match(/<status[^>]*>/)?.[0] || '';
    const ratings = item.match(/<stats[\s\S]*?<\/stats>/)?.[0] || '';
    const avg = ratings.match(/<average[^>]*value="([^"]*)"/)?.[1] || '';
    return { bggId: attr(item, 'objectid'), name: textBetween(item, 'name'), year: textBetween(item, 'yearpublished'), image: textBetween(item, 'image'), thumbnail: textBetween(item, 'thumbnail'), myRating: num(item.match(/<rating[^>]*value="([^"]*)"/)?.[1] || ''), averageRating: num(avg), plays: num(attr(item.match(/<numplays[^>]*>/)?.[0] || '', 'value')), statuses: { own: attr(statusXml, 'own') === '1', want: attr(statusXml, 'want') === '1', wishlist: attr(statusXml, 'wishlist') === '1', wanttoplay: attr(statusXml, 'wanttoplay') === '1', wanttobuy: attr(statusXml, 'wanttobuy') === '1', preordered: attr(statusXml, 'preordered') === '1', fortrade: attr(statusXml, 'fortrade') === '1', prevowned: attr(statusXml, 'prevowned') === '1' } };
  });
  return { url, count: games.length, games };
}
export type SourceSummary = { count: number; min: number | null; avg: number | null; max: number | null; currency: string; cheapestLabel?: string; cheapestUrl?: string; rows?: any[] };
const toNum = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
function summarize(rows: any[], priceKey: string, currency = 'USD', labelFn?: (r: any) => string, urlFn?: (r: any) => string): SourceSummary {
  const filtered = rows.filter((r) => (r.currency || r.newPriceCurrency || 'USD') === currency).map((r) => ({ ...r, _price: toNum(r[priceKey]) })).filter((r) => r._price !== null);
  if (!filtered.length) return { count: rows.length, min: null, avg: null, max: null, currency, rows };
  filtered.sort((a, b) => a._price - b._price);
  const prices = filtered.map((r) => r._price as number);
  const cheapest = filtered[0];
  return { count: rows.length, min: prices[0], avg: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100, max: prices[prices.length - 1], currency, cheapestLabel: labelFn?.(cheapest), cheapestUrl: urlFn?.(cheapest), rows };
}
export async function fetchPrices(bggId: string) {
  const headers = { accept: 'application/json', referer: 'https://boardgamegeek.com/' };
  const urls = { amazon: `https://api.geekdo.com/api/amazon/textads?locale=us&objectid=${bggId}&objecttype=thing`, vendors: `https://api.geekdo.com/api/affiliateads?context=gamemarketplace&objectid=${bggId}&objecttype=thing&previewid=0`, ebay: `https://api.geekdo.com/api/geekbay/items?ajax=1&objectid=${bggId}&objecttype=thing&pageid=1&showcount=25&sort=price`, geekmarket: `https://api.geekdo.com/api/market/products?ajax=1&nosession=1&objectid=${bggId}&objecttype=thing&pageid=1&showcount=50&stock=instock` };
  async function getJson(url: string) { const res = await fetch(url, { headers, next: { revalidate: 21600 } }); if (!res.ok) throw new Error(`${res.status} ${res.statusText}`); return res.json(); }
  const settled = await Promise.allSettled([getJson(urls.amazon), getJson(urls.vendors), getJson(urls.ebay), getJson(urls.geekmarket)]);
  const errors: Record<string, string> = {};
  const [amazonRaw, vendorsRaw, ebayRaw, geekRaw] = settled.map((r, i) => { const k = ['amazon','vendors','ebay','geekmarket'][i]; if (r.status === 'fulfilled') return r.value; errors[k] = r.reason?.message || 'failed'; return null; });
  const a = amazonRaw?.us || null;
  const amazonPrice = toNum(a?.newPriceWithoutSymbol); const listPrice = toNum(a?.listPriceWithoutSymbol);
  const amazon = a ? { price: amazonPrice, currency: a.newPriceCurrency || 'USD', url: a.url, listPrice, discountPercent: amazonPrice && listPrice ? Math.round((1 - amazonPrice / listPrice) * 1000) / 10 : null } : null;
  const vendorsRows = vendorsRaw?.affiliate_ads || []; const ebayRows = ebayRaw?.items || []; const geekRows = geekRaw?.products || [];
  const vendors = summarize(vendorsRows, 'price', 'USD', (r) => r.advertiser?.name, (r) => r.url);
  const ebay = summarize(ebayRows, 'currentprice', 'USD', (r) => r.title, (r) => r.url);
  const geekmarket = summarize(geekRows, 'price', 'USD', (r) => `${r.linkeduser?.username || 'seller'} (${r.prettycondition || ''})`, (r) => `https://boardgamegeek.com${r.producthref}`);
  const candidates = [amazon && { source: 'Amazon', price: amazon.price, currency: amazon.currency, label: 'Amazon', url: amazon.url }, vendors.min && { source: 'Vendors', price: vendors.min, currency: vendors.currency, label: vendors.cheapestLabel, url: vendors.cheapestUrl }, ebay.min && { source: 'eBay', price: ebay.min, currency: ebay.currency, label: ebay.cheapestLabel, url: ebay.cheapestUrl }, geekmarket.min && { source: 'GeekMarket', price: geekmarket.min, currency: geekmarket.currency, label: geekmarket.cheapestLabel, url: geekmarket.cheapestUrl }].filter(Boolean) as any[];
  const usd = candidates.filter((c) => c.currency === 'USD' && c.price != null).sort((a, b) => a.price - b.price);
  return { bggId, amazon, vendors, ebay, geekmarket, bestOverall: usd[0] || null, checkedAt: new Date().toISOString(), errors, urls };
}
