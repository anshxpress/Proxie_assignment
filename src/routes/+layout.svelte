<script lang="ts">
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";
	import { supabase } from "$lib/supabaseClient";
	import "../app.css";
	import type { LayoutData } from "./$types";

	let { data, children }: { data: LayoutData; children: any } = $props();

	onMount(() => {
		// Subscribe to auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (
				event === "SIGNED_IN" ||
				event === "SIGNED_OUT" ||
				event === "TOKEN_REFRESHED"
			) {
				invalidate("supabase:auth");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

{@render children()}
