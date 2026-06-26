import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BGG Price Tracker',
  description: 'BoardGameGeek collection price comparison table'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
