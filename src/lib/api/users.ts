import { apiFetch } from './client';
import type {
  ApiUser,
  ApiUserAddress,
  CreateAddressPayload,
  UpdateProfilePayload,
} from './types';

/** GET /users/profile — current user (JWT required). */
export const fetchProfile = () =>
  apiFetch<ApiUser>('/users/profile', { auth: true });

/** PATCH /users/profile — update name/phone (JWT required; all fields required). */
export const updateProfile = (data: UpdateProfilePayload) =>
  apiFetch<ApiUser>('/users/profile', { method: 'PATCH', body: data, auth: true });

/** GET /users/addresses — saved delivery addresses (JWT required). */
export const fetchAddresses = () =>
  apiFetch<ApiUserAddress[]>('/users/addresses', { auth: true });

/** POST /users/addresses — save a new address (JWT required). */
export const createAddress = (data: CreateAddressPayload) =>
  apiFetch<ApiUserAddress>('/users/addresses', {
    method: 'POST',
    body: data,
    auth: true,
  });

/** PATCH /users/addresses/:id — update an existing address (JWT required). */
export const updateAddress = (addressId: string, data: CreateAddressPayload) =>
  apiFetch<ApiUserAddress>(`/users/addresses/${encodeURIComponent(addressId)}`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
