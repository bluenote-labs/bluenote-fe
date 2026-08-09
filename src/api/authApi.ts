import type {
    KakaoLoginRequest,
    KakaoLoginResponse,
    LogoutResponse,
} from "../types/auth";
import { apiClient, authClient } from "./client";
import { tokenStorage } from "../utils/tokenStorage";

const KAKAO_AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_STATE_KEY = "kakaoOAuthState";

export const redirectToKakaoLogin = () => {
    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const state = crypto.randomUUID();

    sessionStorage.setItem(KAKAO_STATE_KEY, state);

    const searchParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        state,
    });

    window.location.assign(`${KAKAO_AUTHORIZE_URL}?${searchParams.toString()}`);
};

export const validateKakaoState = (receivedState: string | null) => {
    const savedState = sessionStorage.getItem(KAKAO_STATE_KEY);

    return Boolean(receivedState && savedState && receivedState === savedState);
};

export const clearKakaoState = () => {
    sessionStorage.removeItem(KAKAO_STATE_KEY);
};

export const loginWithKakao = async (
    request: KakaoLoginRequest,
): Promise<KakaoLoginResponse> => {
    const response = await authClient.post<KakaoLoginResponse>(
        "/api/auth/kakao",
        request,
    );

    return response.data;
};

export const logout = async (): Promise<void> => {
    try {
        await apiClient.post<LogoutResponse>("/api/auth/logout");
    } finally {
        tokenStorage.remove();
    }
};
