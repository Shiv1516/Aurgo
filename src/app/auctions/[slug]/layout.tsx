import { Metadata } from 'next';
import { auctionAPI } from '@/lib/api';

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await auctionAPI.getBySlug(params.slug);
    const auction = res.data.data;

    return {
      title: auction.title,
      description: auction.shortDescription || auction.description.substring(0, 160),
      openGraph: {
        title: auction.title,
        description: auction.shortDescription || auction.description.substring(0, 160),
        images: auction.coverImage ? [auction.coverImage] : [],
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Auction Details',
    };
  }
}

export default function AuctionLayout({ children }: Props) {
  return <>{children}</>;
}
