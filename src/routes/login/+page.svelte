<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { loginSchema, type LoginFormData } from "$lib/validation";
	import { getAuthErrorMessage } from "$lib/auth-errors";
	import { z } from "zod";

	let email = $state("");
	let password = $state("");
	let rememberMe = $state(false);
	let loading = $state(false);
	let error = $state("");
	let fieldErrors = $state<Partial<Record<keyof LoginFormData, string>>>({});
	let successMessage = $state("");

	function validateField(field: keyof LoginFormData, value: string) {
		try {
			const formData: LoginFormData = { email, password };
			loginSchema.parse(formData);
			fieldErrors[field] = "";
		} catch (err) {
			if (err instanceof z.ZodError) {
				const fieldError = err.issues.find((e) => e.path[0] === field);
				if (fieldError) {
					fieldErrors[field] = fieldError.message;
				}
			}
		}
	}

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		error = "";
		successMessage = "";
		fieldErrors = {};

		const formData: LoginFormData = { email, password };

		try {
			loginSchema.parse(formData);
		} catch (err) {
			if (err instanceof z.ZodError) {
				err.issues.forEach((e) => {
					const field = e.path[0] as keyof LoginFormData;
					fieldErrors[field] = e.message;
				});
				return;
			}
		}

		loading = true;

		try {
			const { data, error: loginError } =
				await supabase.auth.signInWithPassword({
					email: email.trim(),
					password,
				});

			if (loginError) throw loginError;

			if (rememberMe) {
				localStorage.setItem("rememberMe", "true");
			} else {
				localStorage.removeItem("rememberMe");
			}

			successMessage = "Login successful! Redirecting...";

			password = "";

			window.location.href = "/tasks";
		} catch (err: any) {
			error = getAuthErrorMessage(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Welcome Back</CardTitle>
			<CardDescription>Log in to your account to continue</CardDescription
			>
		</CardHeader>
		<CardContent>
			<form onsubmit={handleLogin} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						bind:value={email}
						onblur={() => validateField("email", email)}
						disabled={loading}
						required
					/>
					{#if fieldErrors.email}
						<p class="text-sm text-red-600">{fieldErrors.email}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						onblur={() => validateField("password", password)}
						disabled={loading}
						required
					/>
					{#if fieldErrors.password}
						<p class="text-sm text-red-600">
							{fieldErrors.password}
						</p>
					{/if}
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<Checkbox
							id="remember"
							bind:checked={rememberMe}
							disabled={loading}
						/>
						<Label
							for="remember"
							class="text-sm font-normal cursor-pointer"
						>
							Remember me
						</Label>
					</div>
					<a
						href="/reset-password"
						class="text-sm text-blue-600 hover:underline"
						class:pointer-events-none={loading}
						class:opacity-50={loading}
					>
						Forgot password?
					</a>
				</div>

				{#if error}
					<div class="rounded-md bg-red-50 p-3 text-sm text-red-800">
						{error}
					</div>
				{/if}

				{#if successMessage}
					<div
						class="rounded-md bg-green-50 p-3 text-sm text-green-800"
					>
						{successMessage}
					</div>
				{/if}

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? "Logging in..." : "Log In"}
				</Button>

				<p class="text-center text-sm text-gray-600">
					Don't have an account?
					<a
						href="/signup"
						class="font-medium text-blue-600 hover:underline"
						class:pointer-events-none={loading}
						class:opacity-50={loading}
					>
						Sign up
					</a>
				</p>
			</form>
		</CardContent>
	</Card>
</div>
