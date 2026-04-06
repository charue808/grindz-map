import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return json({ error: 'Missing Query'}, { status: 400 });
	}

	const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&proximity=-157.8583,21.3069&country=US&limit=3&access_token=${PUBLIC_MAPBOX_ACCESS_TOKEN}`)

	const data = await res.json();
	console.log(JSON.stringify(data, null, 2))

	const results = data.features?.map((f: any) => ({
		address: f.properties.full_address,
		latitude: f.properties.coordinates.latitude,
		longitude: f.properties.coordinates.longitude,
		mapbox_id: f.properties.mapbox_id
	})) ?? [];

	return json({ results })
}