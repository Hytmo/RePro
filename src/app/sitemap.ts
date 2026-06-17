import type {MetadataRoute} from 'next';
import {getCategories, searchCompanies} from '@/lib/queries';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://repro-lu.netlify.app';
const locales = ['en', 'de', 'fr', 'lb'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, companies] = await Promise.all([getCategories(), searchCompanies({sort: 'rating'})]);
  const entries: MetadataRoute.Sitemap = [];
  for (const l of locales) {
    entries.push({url: `${BASE}/${l}`, changeFrequency: 'daily', priority: 1});
    entries.push({url: `${BASE}/${l}/categories`, changeFrequency: 'weekly', priority: 0.6});
    entries.push({url: `${BASE}/${l}/business`, changeFrequency: 'monthly', priority: 0.5});
    for (const c of cats) entries.push({url: `${BASE}/${l}/category/${c.slug}`, changeFrequency: 'weekly', priority: 0.7});
    for (const co of companies) entries.push({url: `${BASE}/${l}/company/${co.slug}`, changeFrequency: 'weekly', priority: 0.8});
  }
  return entries;
}
