import axios, { type InternalAxiosRequestConfig } from "axios";

import { ENV } from "@/lib/env";
import { tokenStorage } from "@/lib/token-storage";
import { ENDPOINTS } from "@/constants/endpoints";
import { authApi } from "@/services/auth/authApi";

import type { AuthTokens } from "@/types/auth";

const REQUEST_TIMEOUT_MS = 30_000;

/** Original request config plus a flag marking it as already replayed post-refresh. */
type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

api.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registered once by AuthProvider so the interceptor can clear auth state on 401. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

/**
 * Single-flight refresh: concurrent 401s share one refresh call so the refresh
 * token is rotated exactly once and requests are replayed with the new token.
 */
let refreshPromise: Promise<AuthTokens> | null = null;

function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  refreshPromise ??= authApi.refresh(refreshToken).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const refreshToken = tokenStorage.getRefreshToken();
    const canRefresh =
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      config.url !== ENDPOINTS.AUTH.REFRESH &&
      Boolean(refreshToken);

    if (!canRefresh) {
      if (error.response?.status === 401) {
        unauthorizedHandler?.();
      }
      return Promise.reject(error);
    }

    try {
      const tokens = await refreshTokens(refreshToken as string);
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      config._retry = true;
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return api(config);
    } catch (refreshError) {
      unauthorizedHandler?.();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
