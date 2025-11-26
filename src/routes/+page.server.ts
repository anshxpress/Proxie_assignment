import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Home page server load function
 * Protects this route - only authenticated users can access
 */
export const load: PageServerLoad = async ({ locals }) => {
    // Check if user is authenticated
    if (!locals.session) {
        // Redirect to login if not authenticated
        throw redirect(303, '/login');
    }

    // Return user data if authenticated
    return {
        user: locals.session.user
    };
};
