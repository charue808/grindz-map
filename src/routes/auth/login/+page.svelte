<script lang="ts">
	import { supabase } from "$lib/supabase";

	let email = $state('');
	let message = $state('');
	let loading = $state(false);

	async function handleLogin() {
		loading = true;
		message = '';
		
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`
			}
		})

		if (error) {
			message = error.message;
		} else {
			message = "Check your email for the magic link!";
		}

		loading = false;

	}
</script>

<div>
	<h1>Admin Login</h1>
	<form onsubmit={handleLogin}>
		<label for="email">Email</label>
		<input 
			id="email"
			type="email"
			bind:value={email}
			placeholder="you@example.com"
			required
		/>
		<button type="submit" disabled={loading}>
			{loading ? 'Sending...' : 'Send Magic Link'}
		</button>
	</form>
	{#if message}
		<p>{message}</p>
	{/if}
</div>