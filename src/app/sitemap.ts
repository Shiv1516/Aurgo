import { MetadataRoute } from 'next';
import { auctionAPI, categoryAPI } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://augeo.auction';

  // Base routes
  const routes = [
    '',
    '/auctions',
    '/categories',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  try {
    // Fetch dynamic routes
    const [auctionsRes, categoriesRes] = await Promise.all([
      auctionAPI.getAll({ limit: 100 }),
      categoryAPI.getAll(),
    ]);

    const auctions = auctionsRes.data.data.map((auction: any) => ({
      url: `${baseUrl}/auctions/${auction.slug}`,
      lastModified: new Date(auction.updatedAt || auction.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const categories = categoriesRes.data.data.map((category: any) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...routes, ...auctions, ...categories];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return routes;
  }
}
