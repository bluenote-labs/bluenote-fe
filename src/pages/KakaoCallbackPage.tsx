import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    clearKakaoState,
    loginWithKakao,
    validateKakaoState,
} from "../api/authApi";
import { guestRecordStorage } from "../utils/guestRecordStorage";
import { tokenStorage } from "../utils/tokenStorage";

export const KakaoCallbackPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hasRequested = useRef(false);

    const [apiErrorMessage, setApiErrorMessage] = useState("");

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const kakaoError = searchParams.get("error");

    const isValidState = validateKakaoState(state);

    let requestErrorMessage = "";

    if (kakaoError) {
        requestErrorMessage = "카카오 로그인이 취소되었어요.";
    } else if (!code || !isValidState) {
        requestErrorMessage = "유효하지 않은 로그인 요청이에요.";
    }

    useEffect(() => {
        if (hasRequested.current || requestErrorMessage || !code) {
            return;
        }

        hasRequested.current = true;

        const handleKakaoLogin = async () => {
            try {
                const result = await loginWithKakao({ code });
                const guestRecordDraft = guestRecordStorage.get();

                tokenStorage.set(result.accessToken);
                clearKakaoState();

                if (guestRecordDraft) {
                    navigate("/write/refine", {
                        replace: true,
                    });

                    return;
                }

                navigate("/home", {
                    replace: true,
                });
            } catch (error) {
                clearKakaoState();

                if (axios.isAxiosError(error)) {
                    setApiErrorMessage(
                        error.response?.data?.detail ??
                            "카카오 로그인에 실패했어요.",
                    );
                    return;
                }

                setApiErrorMessage("잠시 후 다시 시도해 주세요.");
            }
        };

        void handleKakaoLogin();
    }, [code, navigate, requestErrorMessage]);

    const errorMessage = requestErrorMessage || apiErrorMessage;

    if (errorMessage) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-5">
                <div className="text-center">
                    <p className="text-foreground">{errorMessage}</p>

                    <button
                        type="button"
                        onClick={() => navigate("/", { replace: true })}
                        className="mt-5 rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground"
                    >
                        처음으로 돌아가기
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
            <p className="text-sm text-muted">
                카카오 로그인을 확인하고 있어요...
            </p>
        </main>
    );
};
