import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { data: restaurant, error: dbError } = await locals.supabase
		.from('restaurants')
		.select('*')
		.eq('id', params.id)
		.single()
	
	if (dbError || !restaurant) {
		error(404, 'Restaurant not found')
	}

	return { restaurant }
}

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();

		const updates: Record<string, any> = {};

		const fields = ['name', 'neighborhood', 'island', 'address', 'mapbox_id'];

		for (const field of fields) {
			const value = formData.get(field);
			if (value !== null) {
				updates[field] = value === '' ? null : String(value)
			}
		}

		const lat = formData.get('latitude');
		const lng = formData.get('longitude');

		if (lat) updates.latitude = parseFloat(String(lat));
		if (lng) updates.longitude = parseFloat(String(lng));

		const { error: dbError } = await locals.supabase
			.from('restaurants')
			.update(updates)
			.eq('id', params.id);
		
		if (dbError) {
			return { success: false, error: dbError.message }
		}

		return { success: true }
	}
}