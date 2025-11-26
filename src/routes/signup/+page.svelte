<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { signUpSchema, type SignUpFormData } from "$lib/validation";
	import { getAuthErrorMessage } from "$lib/auth-errors";
	import { z } from "zod";

	let email = $state("");
	let password = $state("");
	let confirmPassword = $state("");
	let loading = $state(false);
	let error = $state("");
	let fieldErrors = $state<Partial<Record<keyof SignUpFormData, string>>>({});
	let successMessage = $state("");

	/**
	 * Validates a single field and updates field errors
	 */
	function validateField(field: keyof SignUpFormData, value: string) {
		try {
			// Create partial schema for single field validation
			const formData: SignUpFormData = {
				email,
				password,
				confirmPassword,
			};
			signUpSchema.parse(formData);
			// If validation passes, clear the error for this field
			fieldErrors[field] = "";
		} catch (err) {
			if (err instanceof z.ZodError) {
				const fieldError = err.errors.find((e) => e.path[0] === field);
				if (fieldError) {
					fieldErrors[field] = fieldError.message;
				}
			}
		}
	}

	/**
	 * Handles form submission with validation
	 */
	async function handleSignUp(event: SubmitEvent) {
		event.preventDefault();
		error = "";
		successMessage = "";
		fieldErrors = {};

		// Validate form data
		const formData: SignUpFormData = { email, password, confirmPassword };

		try {
			signUpSchema.parse(formData);
		} catch (err) {
			if (err instanceof z.ZodError) {
				// Map validation errors to field errors
				err.errors.forEach((e) => {
					const field = e.path[0] as keyof SignUpFormData;
					fieldErrors[field] = e.message;
				});
				return;
			}
		}

		loading = true;

		try {
			const { data, error: signUpError } = await supabase.auth.signUp({
				email: email.trim(),
				password,
			});

			if (signUpError) throw signUpError;

			// Show success message
			successMessage =
				"Account created successfully! Redirecting to login...";

			// Clear sensitive data
			password = "";
			confirmPassword = "";

			// Redirect after a short delay to show success message
			setTimeout(() => {
				goto("/login");
			}, 1500);
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
			<CardTitle>Create an Account</CardTitle>
			<CardDescription
				>Sign up to start managing your tasks</CardDescription
			>
		</CardHeader>
		<CardContent>
			<form onsubmit={handleSignUp} class="space-y-4">
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
					<p class="text-xs text-gray-500">
						Must be at least 6 characters
					</p>
				</div>

				<div class="space-y-2">
					<Label for="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						type="password"
						placeholder="••••••••"
						bind:value={confirmPassword}
						onblur={() =>
							validateField("confirmPassword", confirmPassword)}
						disabled={loading}
						required
					/>
					{#if fieldErrors.confirmPassword}
						<p class="text-sm text-red-600">
							{fieldErrors.confirmPassword}
						</p>
					{/if}
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
					{loading ? "Creating account..." : "Sign Up"}
				</Button>

				<p class="text-center text-sm text-gray-600">
					Already have an account?
					<a
						href="/login"
						class="font-medium text-blue-600 hover:underline"
						>Log in</a
					>
				</p>
			</form>
		</CardContent>
	</Card>
</div>
