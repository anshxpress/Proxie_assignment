import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { taskSchema } from '$lib/validation';
import { ZodError } from 'zod';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.session) {
        throw redirect(303, '/login');
    }

    const sort = url.searchParams.get('sort') || 'created_at';
    const sortDirection = url.searchParams.get('direction') === 'asc';
    const filterStatus = url.searchParams.get('status');
    const filterPriority = url.searchParams.get('priority');
    const search = url.searchParams.get('search');

    let query = locals.supabase
        .from('tasks')
        .select('*')
        .eq('user_id', locals.session.user.id);

    if (filterStatus && filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
    }

    if (filterPriority && filterPriority !== 'all') {
        query = query.eq('priority', filterPriority);
    }

    if (search) {
        query = query.ilike('title', `%${search}%`);
    }


    query = query.order(sort, { ascending: sortDirection });
    if (sort !== 'created_at') {
        query = query.order('created_at', { ascending: false });
    }

    const { data: tasks, error } = await query;

    if (error) {
        console.error('Error fetching tasks:', error);
    }

    return {
        user: locals.session.user,
        tasks: tasks || []
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const session = locals.session;

        if (!session) {
            return fail(401, {
                error: 'Unauthorized',
                message: 'You must be logged in to create a task'
            });
        }

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {

            const validatedData = taskSchema.parse(data);


            const { error } = await locals.supabase.from('tasks').insert({
                user_id: session.user.id,
                title: validatedData.title,
                description: validatedData.description || null,
                priority: validatedData.priority,
                due_date: validatedData.due_date,
                status: validatedData.status
            });

            if (error) throw error;

            return {
                success: true,
                message: 'Task created successfully'
            };
        } catch (err) {
            if (err instanceof ZodError) {
                const errors = err.flatten().fieldErrors;
                return fail(400, {
                    error: 'Validation Error',
                    errors,
                    data
                });
            }

            return fail(500, {
                error: 'Server Error',
                message: 'Failed to create task. Please try again.',
                data
            });
        }
    },

    update: async ({ request, locals }) => {
        const session = locals.session;
        if (!session) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const data = Object.fromEntries(formData);

        try {
            const validatedData = taskSchema.parse(data);

            const { error } = await locals.supabase
                .from('tasks')
                .update({
                    title: validatedData.title,
                    description: validatedData.description || null,
                    priority: validatedData.priority,
                    due_date: validatedData.due_date,
                    status: validatedData.status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', session.user.id);

            if (error) throw error;

            return { success: true, message: 'Task updated successfully' };
        } catch (err) {
            if (err instanceof ZodError) {
                const errors = err.flatten().fieldErrors;
                return fail(400, { error: 'Validation Error', errors, data });
            }
            return fail(500, { message: 'Failed to update task' });
        }
    },

    delete: async ({ request, locals }) => {
        const session = locals.session;
        if (!session) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const id = formData.get('id') as string;

        const { error } = await locals.supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) return fail(500, { message: 'Failed to delete task' });

        return { success: true, message: 'Task deleted successfully' };
    },

    toggleStatus: async ({ request, locals }) => {
        const session = locals.session;
        if (!session) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const currentStatus = formData.get('currentStatus') as string;

        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';

        const { error } = await locals.supabase
            .from('tasks')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) return fail(500, { message: 'Failed to update status' });

        return { success: true, message: 'Task status updated' };
    }
};
