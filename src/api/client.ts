import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface RefreshTokenResponse {
    accessToken: string;
}

/**
 * 로그인과 토큰 재발급용
 * 인증 인터셉터를 적용하지 않는다.
 */
export const authClient = axios.create({
    baseURL,
    timeout: 10_000,
    withCredentials: true,
});

/**
 * 로그인 이후 일반 API 요청용
 */
export const apiClient = axios.create({
    baseURL,
    timeout: 10_000,
    withCredentials: true,
});

/**
 * Access Token 자동 첨부
 */
apiClient.interceptors.request.use((config) => {
    const accessToken = tokenStorage.get();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

let refreshPromise: Promise<string> | null = null;

/**
 * 401 발생 시 Access Token 재발급
 */
apiClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = authClient
                    .post<RefreshTokenResponse>("/api/auth/refresh")
                    .then((response) => {
                        const newAccessToken = response.data.accessToken;

                        tokenStorage.set(newAccessToken);

                        return newAccessToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            tokenStorage.remove();

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }

            return Promise.reject(refreshError);
        }
    },
);
