import { fetchPrices } from '@/lib/bgg';
export async function POST(req: Request) {
  const { ids = [], limit = 25 } = await req.json();
  const out: any[] = [];
  for (const id of ids.slice(0, limit)) out.push(await fetchPrices(String(id)));
  return Response.json({ count: out.length, results: out });
}
