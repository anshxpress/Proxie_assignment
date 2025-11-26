import type { AuthError } from '@supabase/supabase-js';

/**
 * Maps Supabase authentication error codes to user-friendly messages
 * @param error - The Supabase AuthError object
 * @returns A user-friendly error message
 */
export function getAuthErrorMessage(error: AuthError | Error | unknown): string {
    // Handle non-AuthError cases
    if (!error || typeof error !== 'object') {
        return 'An unexpected error occurred. Please try again.';
    }

    const err = error as any;

    // Check for Supabase-specific error messages
    if (err.message) {
        const message = err.message.toLowerCase();

        // User already exists
        if (message.includes('user already registered') || message.includes('already registered')) {
            return 'An account with this email already exists. Please log in instead.';
        }

        // Invalid credentials
        if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
        }

        // Email not confirmed
        if (message.includes('email not confirmed')) {
            return 'Please confirm your email address before logging in. Check your inbox for a confirmation link.';
        }

        // Too many requests (rate limiting)
        if (message.includes('too many requests') || message.includes('rate limit')) {
            return 'Too many login attempts. Please wait a few minutes and try again.';
        }

        // Network errors
        if (message.includes('network') || message.includes('fetch')) {
            return 'Network error. Please check your internet connection and try again.';
        }

        // Weak password
        if (message.includes('password') && message.includes('weak')) {
            return 'Password is too weak. Please use a stronger password with at least 6 characters.';
        }

        // Invalid email format
        if (message.includes('invalid email')) {
            return 'Please enter a valid email address.';
        }
    }

    // Default error message
    return err.message || 'An error occurred during authentication. Please try again.';
}

/**
 * Checks if an error is a network-related error
 */
export function isNetworkError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const err = error as any;
    const message = err.message?.toLowerCase() || '';
    return message.includes('network') || message.includes('fetch') || message.includes('failed to fetch');
}
