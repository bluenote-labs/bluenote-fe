import desktopBackground from "../assets/images/bluenote-landing-desktop.png";
import mobileBackground from "../assets/images/bluenote-landing-mobile.png";
import { LandingHeader } from "../components/landing/LandingHeader";
import { generateRecord } from "../api/recordApi";
import { GuestRecordForm } from "../components/landing/GuestRecordForm";
import { GuestRecordResult } from "../components/landing/GuestRecordResult";
import { guestRecordStorage } from "../utils/guestRecordStorage";
import { redirectToKakaoLogin } from "../api/authApi";
import { useState } from "react";

export const LandingPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedTitle, setGeneratedTitle] = useState("");
    const [generatedBody, setGeneratedBody] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [guestInput, setGuestInput] = useState("");

    const handleLogin = () => {
        redirectToKakaoLogin();
    };

    const handleGuestRecordLogin = () => {
        if (!generatedTitle.trim() || !generatedBody.trim()) {
            return;
        }

        guestRecordStorage.set({
            input: guestInput,
            title: generatedTitle,
            body: generatedBody,
        });

        redirectToKakaoLogin();
    };

    const handleRecordSubmit = async (content: string) => {
        setGuestInput(content);
        setIsLoading(true);
        setGeneratedTitle("");
        setGeneratedBody("");
        setErrorMessage("");

        try {
            await generateRecord(
                {
                    input: content,
                },
                {
                    onEvent: (event) => {
                        if (event.type === "title") {
                            setGeneratedTitle(event.content);
                        }

                        if (event.type === "body") {
                            setGeneratedBody((previousBody) => {
                                return previousBody + event.content;
                            });
                        }
                    },
                },
            );
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "기록 정리에 실패했어요.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative isolate min-h-[100svh] overflow-x-hidden bg-background">
            <picture className="absolute inset-0 z-0">
                <source media="(max-width: 639px)" srcSet={mobileBackground} />

                <img
                    src={desktopBackground}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover object-center"
                />
            </picture>

            <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-background/20 via-transparent to-background/55 sm:bg-linear-to-l sm:from-background/35 sm:via-transparent sm:to-transparent" />

            <div className="relative z-20 flex min-h-[100svh] flex-col">
                <LandingHeader onLogin={handleLogin} />

                <section className="mx-auto flex w-full max-w-7xl flex-1 items-start justify-end px-5 pt-8 pb-8 sm:items-center sm:px-6 sm:py-10 lg:px-8">
                    <div className="w-full max-w-xl">
                        <p className="text-sm font-medium text-moonlight">
                            나를 이해하는 기록
                        </p>

                        <h1 className="mt-4 text-3xl leading-tight font-semibold text-foreground sm:text-4xl lg:text-5xl">
                            기록은 나를 이해하는
                            <br />
                            가장 조용한 방법입니다.
                        </h1>

                        <p className="mt-5 text-sm leading-7 text-body sm:text-base">
                            정리되지 않아도 괜찮습니다.
                            <br />
                            오늘 있었던 일을 편하게 남겨보세요.
                        </p>

                        <GuestRecordForm
                            isLoading={isLoading}
                            onSubmit={handleRecordSubmit}
                        />

                        {errorMessage && (
                            <p role="alert" className="mt-4 text-sm text-error">
                                {errorMessage}
                            </p>
                        )}

                        {(isLoading || generatedTitle || generatedBody) && (
                            <GuestRecordResult
                                title={generatedTitle}
                                body={generatedBody}
                                isLoading={isLoading}
                                onTitleChange={setGeneratedTitle}
                                onBodyChange={setGeneratedBody}
                                onLogin={handleGuestRecordLogin}
                            />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};
