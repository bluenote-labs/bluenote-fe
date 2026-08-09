import desktopBackground from "../assets/images/bluenote-landing-desktop.png";
import mobileBackground from "../assets/images/bluenote-landing-mobile.png";
import { LandingHeader } from "../components/landing/LandingHeader";

export const LandingPage = () => {
    const handleLogin = () => {
        console.log("카카오 로그인");
    };

    return (
        <main className="relative isolate min-h-[100svh] overflow-hidden bg-background">
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

                        {/* 다음 단계에서 기록 입력창으로 교체 */}
                        <div className="mt-8 rounded-card border border-foreground/15 bg-background/65 p-5 backdrop-blur-md sm:p-6">
                            <p className="text-sm text-muted">
                                이곳에 기록 입력창을 추가할 예정입니다.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
