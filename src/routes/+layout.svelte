<script lang="ts">
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";
	import { supabase } from "$lib/supabaseClient";
	import "../app.css";
	import type { LayoutData } from "./$types";

	let { data, children }: { data: LayoutData; children: any } = $props();

	/**
	 * Set up auth state listener for session persistence
	 * This ensures the session stays in sync across tabs and page refreshes
	 */
	onMount(() => {
		// Subscribe to auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			// Invalidate all data when auth state changes
			// This will re-run all load functions and update the UI
			if (
				event === "SIGNED_IN" ||
				event === "SIGNED_OUT" ||
				event === "TOKEN_REFRESHED"
			) {
				invalidate("supabase:auth");
			}
		});

		// Cleanup subscription on component destroy
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

{@render children()}
