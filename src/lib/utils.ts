import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function formatDate(date: string | Date): string {
	if (!date) return '';
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function getPriorityColor(priority: string): string {
	switch (priority?.toLowerCase()) {
		case 'high':
			return 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200';
		case 'medium':
			return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200';
		case 'low':
			return 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200';
		default:
			return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200';
	}
}

export function getStatusColor(status: string): string {
	switch (status?.toLowerCase()) {
		case 'completed':
			return 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200';
		case 'in progress':
			return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200';
		case 'pending':
			return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200';
		default:
			return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200';
	}
}
