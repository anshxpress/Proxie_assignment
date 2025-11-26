import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Sign up page server load function
 * Redirects authenticated users to home page
 */
export const load: PageServerLoad = async ({ locals }) => {
    // If user is already authenticated, redirect to home
    if (locals.session) {
        throw redirect(303, '/');
    }

    return {};
};
