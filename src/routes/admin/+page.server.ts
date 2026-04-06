import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: restaurants, error } = await locals.supabase
		.from('restaurants')
		.select('*, reviews(count)')
		.order('created_at', { ascending: false })

	if (error) {
		console.error('Error loading restaurants:', error)
		return { restaurants: [] }
	}

	return { restaurants }
}