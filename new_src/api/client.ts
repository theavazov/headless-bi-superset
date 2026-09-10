import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

import {
    getAccessToken,
    refreshAccessToken,
    clearTokens,
} from "./auth";

const SUPERSET_URL = import.meta.env.VITE_SUPERSET_URL;

export const supersetClient = axios.create({
    baseURL: SUPERSET_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise: Promise<string> | null = null;

const getTokenExpiration = (token: string): number | null => {
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1]),
        );

        return payload.exp ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
};

const isTokenExpiringSoon = (
    token: string,
    bufferMs = 60_000,
): boolean => {
    const expiration = getTokenExpiration(token);

    if (!expiration) {
        return false;
    }

    return expiration - Date.now() <= bufferMs;
};

const refreshTokenOnce = async (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

supersetClient.interceptors.request.use(
    async (
        config: InternalAxiosRequestConfig,
    ) => {
        let token = getAccessToken();

        if (token && isTokenExpiringSoon(token)) {
            token = await refreshTokenOnce();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
);

supersetClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & {
                _retry?: boolean;
            })
            | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newAccessToken = await refreshTokenOnce();

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return supersetClient(originalRequest);
        } catch (refreshError) {
            clearTokens();

            // Optional: redirect to your login page
            window.location.href = "/login";

            return Promise.reject(refreshError);
        }
    },
);