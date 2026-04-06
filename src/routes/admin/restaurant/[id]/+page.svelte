<script lang="ts">
	import { enhance } from "$app/forms";
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public";
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	let { data, form } = $props();

	let restaurant = $state({ ...data.restaurant });
	let addressQuery = $state(restaurant.address ?? '');
	let geocodeResults = $state<any[]>([]);
	let searching = $state(false);

	let mapContainer = $state<HTMLDivElement>()
  let map = $state<mapboxgl.Map>()
  let marker = $state<mapboxgl.Marker>()

	 $effect(() => {
    restaurant = { ...data.restaurant }
    addressQuery = data.restaurant.address ?? ''
  })

	$effect(() => {
    if (!mapContainer) return

    mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN

    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [
        restaurant.longitude ?? -157.8583,
        restaurant.latitude ?? 21.3069
      ],
      zoom: restaurant.latitude ? 15 : 10
    })

    if (restaurant.latitude && restaurant.longitude) {
      marker = new mapboxgl.Marker()
        .setLngLat([restaurant.longitude, restaurant.latitude])
        .addTo(map)
    }

    return () => map?.remove()
  })

  function updateMapPin() {
    if (!map || !restaurant.latitude || !restaurant.longitude) return

    if (marker) marker.remove()

    marker = new mapboxgl.Marker()
      .setLngLat([restaurant.longitude, restaurant.latitude])
      .addTo(map)

    map.flyTo({
      center: [restaurant.longitude, restaurant.latitude],
      zoom: 15
    })
  }

	async function validateAddress() {
		if (!addressQuery.trim()) return;

		searching = true;
		const res = await fetch(`/api/geocode?q=${encodeURIComponent(addressQuery)}`)
    const data = await res.json()
    geocodeResults = data.results ?? []
    searching = false
	}

	function selectResult(result: any) {
    restaurant.address = result.address
    restaurant.latitude = result.latitude
    restaurant.longitude = result.longitude
    restaurant.mapbox_id = result.mapbox_id
    geocodeResults = []
    addressQuery = result.address
		updateMapPin()
  }
</script>

<h1>Edit: {data.restaurant.name}</h1>

<a href="/admin">← Back to list</a>

{#if form?.success}
  <p>✅ Saved successfully</p>
{/if}
{#if form?.error}
  <p>❌ {form.error}</p>
{/if}

<form method="POST" action="?/update" use:enhance>
  <label>
    Name
    <input name="name" bind:value={restaurant.name} required />
  </label>

  <label>
    Neighborhood
    <input name="neighborhood" bind:value={restaurant.neighborhood} />
  </label>

  <label>
    Island
    <input name="island" bind:value={restaurant.island} />
  </label>

  <hr />

  <h2>Address & Location</h2>

  <div>
    <label>
      Search address
      <input bind:value={addressQuery} placeholder="e.g. 933 Kapahulu Ave Honolulu" />
    </label>
    <button type="button" onclick={validateAddress} disabled={searching}>
      {searching ? 'Searching...' : 'Validate Address'}
    </button>
  </div>

  {#if geocodeResults.length > 0}
    <ul>
      {#each geocodeResults as result}
        <li>
          <button type="button" onclick={() => selectResult(result)}>
            📍 {result.address}
            <small>({result.latitude.toFixed(4)}, {result.longitude.toFixed(4)})</small>
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <label>
    Address
    <input name="address" bind:value={restaurant.address} />
  </label>

  <label>
    Latitude
    <input name="latitude" type="number" step="any" bind:value={restaurant.latitude} />
  </label>

  <label>
    Longitude
    <input name="longitude" type="number" step="any" bind:value={restaurant.longitude} />
  </label>

  <input type="hidden" name="mapbox_id" value={restaurant.mapbox_id ?? ''} />
	
  <button type="submit">Save</button>
</form>

<div bind:this={mapContainer} style="width: 100%; height: 300px; border-radius: 8px; margin: 1rem 0;"></div>