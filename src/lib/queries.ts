import {createClient} from '@supabase/supabase-js';

// Anon client for public reads (RLS exposes verified companies + published reviews).
function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {auth: {persistSession: false}}
  );
}

export interface CompanyFilters {
  q?: string;
  category?: string;
  minRating?: number;
  badgedOnly?: boolean;
  city?: string;
  sort?: string;
}

export async function getCategories() {
  const {data} = await db().from('categories').select('*').order('sort_order');
  return data ?? [];
}

export async function getCategoryBySlug(slug: string) {
  const {data} = await db().from('categories').select('*').eq('slug', slug).maybeSingle();
  return data;
}

export async function getCities(): Promise<string[]> {
  const {data} = await db().from('companies').select('city').eq('status', 'verified');
  const set = new Set<string>();
  (data ?? []).forEach((r: {city: string | null}) => r.city && set.add(r.city));
  return Array.from(set).sort();
}

export async function searchCompanies(f: CompanyFilters) {
  let companyIds: string[] | null = null;
  if (f.category) {
    const {data: links} = await db()
      .from('company_categories')
      .select('company_id, categories!inner(slug)')
      .eq('categories.slug', f.category);
    companyIds = (links ?? []).map((l: {company_id: string}) => l.company_id);
    if (companyIds.length === 0) return [];
  }

  let query = db()
    .from('companies')
    .select('*, company_categories(categories(slug,name,icon))')
    .eq('status', 'verified');

  if (companyIds) query = query.in('id', companyIds);
  if (f.q) query = query.ilike('name', `%${f.q}%`);
  if (f.city) query = query.ilike('city', `%${f.city}%`);
  if (f.minRating) query = query.gte('rating_avg', f.minRating);
  if (f.badgedOnly) query = query.eq('is_badged', true);

  switch (f.sort) {
    case 'rating':
      query = query.order('rating_avg', {ascending: false});
      break;
    case 'reviews':
      query = query.order('rating_count', {ascending: false});
      break;
    case 'newest':
      query = query.order('created_at', {ascending: false});
      break;
    default:
      query = query.order('is_badged', {ascending: false}).order('rating_avg', {ascending: false});
  }

  const {data} = await query.limit(60);
  return data ?? [];
}

export async function getCompanyBySlug(slug: string) {
  const {data} = await db()
    .from('companies')
    .select('*, company_categories(categories(slug,name,icon))')
    .eq('slug', slug)
    .eq('status', 'verified')
    .maybeSingle();
  return data;
}

export async function getCompanyReviews(companyId: string) {
  const {data} = await db()
    .from('reviews')
    .select('*, profiles!reviews_author_id_fkey(display_name, avatar_url), review_responses(*)')
    .eq('company_id', companyId)
    .eq('status', 'published')
    .order('created_at', {ascending: false});
  return data ?? [];
}
