<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";

    let userEmail = $state<string | null>(null);
    let loading = $state(true);

    onMount(async () => {
        // Check if user is authenticated
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            // Redirect to login if not authenticated
            goto("/login");
            return;
        }

        userEmail = session.user.email || null;
        loading = false;
    });

    async function handleLogout() {
        await supabase.auth.signOut();
        goto("/login");
    }
</script>

{#if loading}
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
        <p class="text-gray-600">Loading...</p>
    </div>
{:else}
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card class="w-full max-w-md">
            <CardHeader>
                <CardTitle>Welcome to Task Manager!</CardTitle>
                <CardDescription>You're successfully logged in</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="rounded-md bg-green-50 p-4">
                    <p class="text-sm text-green-800">
                        <strong>Logged in as:</strong>
                        {userEmail}
                    </p>
                </div>

                <div class="space-y-2">
                    <p class="text-sm text-gray-600">
                        This is a placeholder home page. Task management
                        features will be added in Day 4-6.
                    </p>
                </div>

                <Button onclick={handleLogout} variant="outline" class="w-full">
                    Log Out
                </Button>
            </CardContent>
        </Card>
    </div>
{/if}
