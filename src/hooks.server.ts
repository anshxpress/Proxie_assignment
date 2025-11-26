import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

/**
 * Server-side authentication hook
 * Runs on every request to check and attach Supabase session
 */
export const handle: Handle = async ({ event, resolve }) => {
    // Create Supabase client for this request
    event.locals.supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        auth: {
            flowType: 'pkce',
            autoRefreshToken: true,
            detectSessionInUrl: true,
            persistSession: true
        }
    });

    // Get session from Supabase
    const {
        data: { session }
    } = await event.locals.supabase.auth.getSession();

    // Attach session to event.locals for use in load functions
    event.locals.session = session;

    // Continue with the request
    return resolve(event);
};
