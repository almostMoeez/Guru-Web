import { apiFetch } from './client';
import type { ApiOrder, CreateOrderPayload } from './types';

/** POST /orders — places an order for the authenticated user (JWT required). */
export const createOrder = (payload: CreateOrderPayload) =>
  apiFetch<ApiOrder>('/orders', { method: 'POST', body: payload, auth: true });

/** GET /orders — the signed-in user's own orders, newest first (JWT required). */
export const fetchMyOrders = (signal?: AbortSignal) =>
  apiFetch<ApiOrder[]>('/orders', { auth: true, signal });
