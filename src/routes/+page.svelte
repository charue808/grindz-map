<script lang="ts">
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public";
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	let { data } = $props();


	let mapContainer = $state<HTMLDivElement>();
	let popup = $state<mapboxgl.Popup>();

	  $effect(() => {
    if (!mapContainer) return

    mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-157.8583, 21.3069],
      zoom: 11
    })

    map.addControl(new mapboxgl.NavigationControl())

    for (const r of data.restaurants) {
      const el = document.createElement('div')
      el.style.cssText = 'width:28px;height:28px;font-size:24px;cursor:pointer;'
      el.textContent = '📍'

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([r.longitude, r.latitude])
        .addTo(map)

      marker.getElement().addEventListener('click', () => {
        if (popup) popup.remove()

        popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat([r.longitude, r.latitude])
          .setHTML(`
            <div style="padding:4px;">
              <strong>${r.name}</strong>
              ${r.neighborhood ? `<br/><small>${r.neighborhood}</small>` : ''}
              ${r.address ? `<br/><small>${r.address}</small>` : ''}
              ${r.vibe_score ? `<br/>Vibe: ${'🔥'.repeat(Math.round(r.vibe_score))}` : ''}
              ${r.review_count ? `<br/><small>${r.review_count} review${r.review_count > 1 ? 's' : ''}</small>` : ''}
            </div>
          `)
          .addTo(map)
      })
    }

    return () => map.remove()
  })
</script>

<div bind:this={mapContainer} style="width: 100%; height: 100vh;"></div>