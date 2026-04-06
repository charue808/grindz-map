<script lang="ts">
	
	let { data } = $props();

</script>

<h1>Restaurants</h1>
<p>{data.restaurants.length} restaurants in database</p>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Neighborhood</th>
			<th>Address</th>
			<th>Coordinates</th>
			<th>Reviews</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each data.restaurants as restaurant}
			<tr>
				<td>{restaurant.name}</td>
				<td>{restaurant.neighborhood ?? '-'}</td>
				<td>{restaurant.address ?? '⚠️ Missing'}</td>
				<td>
					{#if restaurant.latitude && restaurant.longitude}
						✅
					{:else}
						⚠️ Missing
					{/if}
				</td>
				<td>{restaurant.reviews?.[0]?.count ?? 0}</td>
				<td>
					<a href="/admin/restaurant/{restaurant.id}">Edit</a>
				</td>
			</tr>
		{/each} 
	</tbody>
</table>