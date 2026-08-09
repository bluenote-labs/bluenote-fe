export interface KakaoLoginRequest {
    code: string;
}

export interface AuthUser {
    id: string;
    nickname: string;
    profileImage: string | null;
}

export interface KakaoLoginResponse {
    accessToken: string;
    user: AuthUser;
    isNewUser: boolean;
}

export interface LogoutResponse {
    message: string;
}
