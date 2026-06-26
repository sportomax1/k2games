import { fetchBggCollection, CollectionStatus } from '@/lib/bgg';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || 'sportomax';
  const statuses = (searchParams.get('statuses') || 'own').split(',').filter(Boolean) as CollectionStatus[];
  return Response.json(await fetchBggCollection(username, statuses));
}
