import axios from "axios";

const SUPERSET_URL = import.meta.env.VITE_SUPERSET_URL;

const ACCESS_TOKEN_KEY = "superset_access_token";
const REFRESH_TOKEN_KEY = "superset_refresh_token";
const TOKEN_REFRESHED_AT_KEY = "superset_token_refreshed_at";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export interface SupersetLoginResponse {
    access_token: string;
    refresh_token: string;
}

export interface SupersetRefreshResponse {
    access_token: string;
}

const isSessionExpired = (): boolean => {
    const refreshedAt = localStorage.getItem(TOKEN_REFRESHED_AT_KEY);

    if (!refreshedAt) {
        return true;
    }

    const timestamp = new Date(refreshedAt).getTime();

    if (Number.isNaN(timestamp)) {
        return true;
    }

    return Date.now() - timestamp >= SESSION_DURATION_MS;
};

export const getAccessToken = (): string | null => {
    if (isSessionExpired()) {
        clearTokens();
        return null;
    }

    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
    if (isSessionExpired()) {
        clearTokens();
        return null;
    }

    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (
    accessToken: string,
    refreshToken?: string,
) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

        localStorage.setItem(
            TOKEN_REFRESHED_AT_KEY,
            new Date().toISOString(),
        );
    }
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_REFRESHED_AT_KEY);
};

export const login = async (
    username: string,
    password: string,
): Promise<void> => {
    const response = await axios.post<SupersetLoginResponse>(
        `${SUPERSET_URL}/api/v1/security/login`,
        {
            username,
            password,
            provider: "db",
            refresh: true,
        },
    );

    setTokens(
        response.data.access_token,
        response.data.refresh_token,
    );
};

export const refreshAccessToken = async (): Promise<string> => {
    if (isSessionExpired()) {
        clearTokens();
        throw new Error("Superset session expired. Please login again.");
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error("No Superset refresh token");
    }

    const response = await axios.post<SupersetRefreshResponse>(
        `${SUPERSET_URL}/api/v1/security/refresh`,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        },
    );

    setTokens(response.data.access_token);

    return response.data.access_token;
};

export const logout = () => {
    clearTokens();
};