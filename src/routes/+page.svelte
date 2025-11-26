<script lang="ts">
    import type { PageData } from "./$types";
    import { goto, invalidateAll } from "$app/navigation";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { supabase } from "$lib/supabaseClient";

    let { data }: { data: PageData } = $props();

    let loggingOut = $state(false);
    let logoutError = $state("");

    async function handleLogout() {
        loggingOut = true;
        logoutError = "";

        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            localStorage.removeItem("rememberMe");

            await invalidateAll();

            goto("/login");
        } catch (err: any) {
            logoutError = err.message || "Failed to log out. Please try again.";
        } finally {
            loggingOut = false;
        }
    }
</script>

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
                    {data.user?.email || "Unknown"}
                </p>
            </div>

            <div class="space-y-4">
                <p class="text-sm text-gray-600">
                    Manage your tasks, track progress, and stay organized.
                </p>
                <div class="flex gap-3">
                    <Button href="/tasks" class="w-full">Go to Dashboard</Button
                    >
                </div>
            </div>

            {#if logoutError}
                <div class="rounded-md bg-red-50 p-3 text-sm text-red-800">
                    {logoutError}
                </div>
            {/if}

            <Button
                onclick={handleLogout}
                variant="outline"
                class="w-full"
                disabled={loggingOut}
            >
                {loggingOut ? "Logging out..." : "Log Out"}
            </Button>
        </CardContent>
    </Card>
</div>
