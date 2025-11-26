import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' });
                });
            },
        },
    });

    /**
     * Unlike `supabase.auth.getSession()`, which is unsafe on the server because it
     * doesn't validate the token, this function validates the token by calling
     * the user endpoint.
     */
    const {
        data: { user },
    } = await event.locals.supabase.auth.getUser();

    event.locals.user = user;
    event.locals.session = null; // Session is less reliable on server, rely on user. But for compatibility we can try to get it if needed, or just use user.
    // Actually, getting the session is still useful for some things, but getUser is safer.
    // Let's stick to the standard pattern.
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    event.locals.session = session;

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version';
        },
    });
};
