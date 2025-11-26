import type { LayoutServerLoad } from './$types';

/**
 * Root layout server load function
 * Makes session available to all child routes
 */
export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        session: locals.session
    };
};
