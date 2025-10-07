import {twMerge} from 'tailwind-merge';
import {cx} from 'class-variance-authority';

export const cn = (...args: any[]) => twMerge(cx(...args));