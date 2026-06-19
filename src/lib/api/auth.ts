import { apiFetch } from './client';
import type { RequestOtpResponse, VerifyOtpResponse } from './types';

/** POST /auth/request-otp — emails a 6-digit code to the address. */
export const requestOtp = (email: string) =>
  apiFetch<RequestOtpResponse>('/auth/request-otp', {
    method: 'POST',
    body: { email },
  });

/** POST /auth/verify-otp — exchanges the code for a JWT access token. */
export const verifyOtp = (email: string, code: string) =>
  apiFetch<VerifyOtpResponse>('/auth/verify-otp', {
    method: 'POST',
    body: { email, code },
  });
