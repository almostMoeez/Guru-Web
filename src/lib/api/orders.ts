import { apiFetch } from './client';
import type { ApiOrder, CreateOrderPayload } from './types';

/** POST /orders — places an order for the authenticated user (JWT required). */
export const createOrder = (payload: CreateOrderPayload) =>
  apiFetch<ApiOrder>('/orders', { method: 'POST', body: payload, auth: true });

/** GET /orders?userId=... — orders for a given user (JWT required). */
export const fetchOrdersByUser = (userId: string) =>
  apiFetch<ApiOrder[]>(`/orders?userId=${encodeURIComponent(userId)}`, {
    auth: true,
  });
