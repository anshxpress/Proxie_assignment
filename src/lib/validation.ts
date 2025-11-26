import { z } from 'zod';


export const signUpSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});


export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required')
});


export const taskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must be 100 characters or less'),
    description: z
        .string()
        .max(500, 'Description must be 500 characters or less')
        .optional(),
    priority: z.enum(['Low', 'Medium', 'High'], {
        message: 'Please select a priority level'
    }),
    due_date: z.string().min(1, 'Due date is required'),
    status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending')
});


export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
