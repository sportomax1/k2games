import { fetchPrices } from '@/lib/bgg';
export async function GET(_: Request, { params }: { params: { bggId: string } }) {
  return Response.json(await fetchPrices(params.bggId));
}
