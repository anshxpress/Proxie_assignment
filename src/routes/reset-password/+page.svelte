<script lang="ts">
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

    let email = "";
    let submitted = false;

    function handleReset() {
        // Placeholder - will be implemented later
        submitted = true;
    }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <Card class="w-full max-w-md">
        <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription
                >Enter your email to receive a password reset link</CardDescription
            >
        </CardHeader>
        <CardContent>
            {#if !submitted}
                <form on:submit|preventDefault={handleReset} class="space-y-4">
                    <div class="space-y-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            bind:value={email}
                            required
                        />
                    </div>

                    <Button type="submit" class="w-full">Send Reset Link</Button
                    >

                    <p class="text-center text-sm text-gray-600">
                        Remember your password?
                        <a
                            href="/login"
                            class="font-medium text-blue-600 hover:underline"
                            >Log in</a
                        >
                    </p>
                </form>
            {:else}
                <div class="space-y-4">
                    <div
                        class="rounded-md bg-green-50 p-3 text-sm text-green-800"
                    >
                        If an account exists with this email, you will receive a
                        password reset link shortly.
                    </div>
                    <Button href="/login" class="w-full">Back to Login</Button>
                </div>
            {/if}
        </CardContent>
    </Card>
</div>
