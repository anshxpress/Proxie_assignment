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
	import {
		CheckCircle2,
		Layout,
		ListTodo,
		ShieldCheck,
	} from "@lucide/svelte";

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

<div class="flex min-h-screen w-full">
	<!-- Hero Section (Left Side) -->
	<div
		class="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white overflow-hidden"
	>
		<!-- Abstract Background Shapes -->
		<div
			class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20"
		>
			<div
				class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600 blur-[100px]"
			></div>
			<div
				class="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600 blur-[100px]"
			></div>
		</div>

		<div class="relative z-10">
			<div
				class="flex items-center gap-2 text-lg font-bold tracking-tight"
			>
				<Layout class="h-6 w-6" />
				<span>TaskManager</span>
			</div>
		</div>

		<div class="relative z-10 space-y-6 max-w-lg">
			<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
				Organize your work, <br />
				<span class="text-blue-400">amplify your productivity.</span>
			</h1>
			<p class="text-lg text-slate-300">
				Streamline your projects, collaborate with your team, and hit
				your deadlines with our intuitive task management platform.
			</p>

			<div class="space-y-4 pt-4">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
					>
						<ListTodo class="h-5 w-5 text-blue-300" />
					</div>
					<div>
						<h3 class="font-semibold">Smart Task Tracking</h3>
						<p class="text-sm text-slate-400">
							Keep everything in one place.
						</p>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
					>
						<ShieldCheck class="h-5 w-5 text-indigo-300" />
					</div>
					<div>
						<h3 class="font-semibold">Secure & Reliable</h3>
						<p class="text-sm text-slate-400">
							Your data is safe with us.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="relative z-10">
			<p class="text-sm text-slate-500">
				&copy; {new Date().getFullYear()} TaskManager Inc. All rights reserved.
			</p>
		</div>
	</div>

	<!-- Login Form Section (Right Side) -->
	<div
		class="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 px-4 py-12"
	>
		<Card
			class="w-full max-w-md border-0 shadow-none bg-transparent sm:border sm:shadow-sm sm:bg-white"
		>
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl font-bold tracking-tight"
					>Welcome back</CardTitle
				>
				<CardDescription>
					Enter your email to sign in to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onsubmit={handleLogin} class="space-y-4">
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							bind:value={email}
							onblur={() => validateField("email", email)}
							disabled={loading}
							required
							class="bg-white"
						/>
						{#if fieldErrors.email}
							<p class="text-sm text-red-600">
								{fieldErrors.email}
							</p>
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
							class="bg-white"
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
						<div
							class="rounded-md bg-red-50 p-3 text-sm text-red-800 flex items-center gap-2"
						>
							<CheckCircle2 class="h-4 w-4 text-red-800" />
							{error}
						</div>
					{/if}

					{#if successMessage}
						<div
							class="rounded-md bg-green-50 p-3 text-sm text-green-800 flex items-center gap-2"
						>
							<CheckCircle2 class="h-4 w-4 text-green-800" />
							{successMessage}
						</div>
					{/if}

					<Button type="submit" class="w-full" disabled={loading}>
						{loading ? "Signing in..." : "Sign In"}
					</Button>

					<p class="text-center text-sm text-gray-600 pt-2">
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
</div>
