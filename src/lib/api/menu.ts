import { apiFetch } from './client';
import type { ApiCategory, ApiCategoryGroup } from './types';

/** GET /menu — all categories with their items (and nested modifiers). */
export const fetchMenu = (signal?: AbortSignal) =>
  apiFetch<ApiCategoryGroup[]>('/menu', { signal });

/** GET /menu/categories — flat list of categories. */
export const fetchCategories = (signal?: AbortSignal) =>
  apiFetch<ApiCategory[]>('/menu/categories', { signal });
