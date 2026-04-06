<script lang="ts">
	import { supabase } from "$lib/supabase";
	import { goto } from "$app/navigation";

	let { data, children } = $props();
	
	async function handleLogout() {
		await supabase.auth.signOut();
		goto('/auth/login');
	}
</script>

<nav>
	<a href="/admin">Dashboard</a>
	<span>{data.session.user.email}</span>
	<button onclick={handleLogout}>Logout</button>
</nav>

<main>
	{@render children()}
</main>