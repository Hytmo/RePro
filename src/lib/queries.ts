import {createClient} from '@supabase/supabase-js';

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {auth: {persistSession: false}});
}

export interface CompanyFilters {
  q?: string; category?: string; minRating?: number; badgedOnly?: boolean; city?: string; sort?: string;
}

export async function getCategories() {
  const {data} = await db().from('categories').select('*').order('sort_order');
  return data ?? [];
}
export async function getCategoryBySlug(slug: string) {
  const {data} = await db().from('categories').select('*').eq('slug', slug).maybeSingle();
  return data;
}
export async function getCategoryById(id: string) {
  const {data} = await db().from('categories').select('*').eq('id', id).maybeSingle();
  return data;
}
export async function getChildCategories(parentId: string) {
  const {data} = await db().from('categories').select('*').eq('parent_id', parentId).order('sort_order');
  return data ?? [];
}
// Sectors (parent_id null) with their child subcategories nested.
export async function getCategoryTree() {
  const cats = await getCategories();
  const nodes = new Map<string, any>();
  cats.forEach((c: any) => nodes.set(c.id, {...c, children: []}));
  const roots: any[] = [];
  nodes.forEach((c: any) => {
    if (c.parent_id && nodes.has(c.parent_id)) nodes.get(c.parent_id).children.push(c);
    else if (!c.parent_id) roots.push(c);
  });
  const bySort = (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
  roots.sort(bySort);
  roots.forEach((r) => r.children.sort(bySort));
  return roots;
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
    // Resolve the category; if it's a sector, include all of its subcategories.
    const {data: cat} = await db().from('categories').select('id, parent_id').eq('slug', f.category).maybeSingle();
    if (!cat) return [];
    const {data: kids} = await db().from('categories').select('id').eq('parent_id', cat.id);
    const catIds = [cat.id, ...((kids ?? []) as {id: string}[]).map((k) => k.id)];
    const {data: links} = await db().from('company_categories').select('company_id').in('category_id', catIds);
    companyIds = Array.from(new Set(((links ?? []) as {company_id: string}[]).map((l) => l.company_id)));
    if (companyIds.length === 0) return [];
  }
  let query = db().from('companies').select('*, company_categories(categories(slug,name,icon))').eq('status', 'verified');
  if (companyIds) query = query.in('id', companyIds);
  if (f.q) query = query.ilike('name', `%${f.q}%`);
  if (f.city) query = query.ilike('city', `%${f.city}%`);
  if (f.minRating) query = query.gte('rating_avg', f.minRating);
  if (f.badgedOnly) query = query.eq('is_badged', true);
  switch (f.sort) {
    case 'rating': query = query.order('rating_avg', {ascending: false}); break;
    case 'reviews': query = query.order('rating_count', {ascending: false}); break;
    case 'newest': query = query.order('created_at', {ascending: false}); break;
    default: query = query.order('rating_avg', {ascending: false}).order('rating_count', {ascending: false});
  }
  const {data} = await query.limit(120);
  return data ?? [];
}

export async function getCompanyBySlug(slug: string) {
  const {data} = await db().from('companies').select('*, company_categories(categories(slug,name,icon))').eq('slug', slug).eq('status', 'verified').maybeSingle();
  return data;
}

export async function getCompaniesBySlugs(slugs: string[]) {
  if (!slugs.length) return [];
  const {data} = await db().from('companies').select('*, company_categories(categories(slug,name,icon))').in('slug', slugs).eq('status', 'verified');
  return data ?? [];
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

export async function getCompanySummary(companyId: string) {
  const {data} = await db().from('company_summaries').select('*').eq('company_id', companyId).maybeSingle();
  return data;
}
