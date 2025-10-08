import { twMerge } from 'tailwind-merge';
import { cx } from 'class-variance-authority';

export const cn = (...args: Parameters<typeof cx>) => twMerge(cx(...args));
