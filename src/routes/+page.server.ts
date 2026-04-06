import { createSupabaseServerClient } from "$lib/server/supabase-server";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = await createSupabaseServerClient(cookies);

	const { data: restaurants } = await supabase
		.from('restaurants')
		.select('id, name, neighborhood, address, latitude, longitude, vibe_score, review_count')
		.not('latitude', 'is', null)
		.not('longitude', 'is', null)

	return { restaurants: restaurants ?? [] }
}