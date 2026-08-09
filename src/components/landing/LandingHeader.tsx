type LandingHeaderProps = {
    onLogin: () => void;
};

export const LandingHeader = ({ onLogin }: LandingHeaderProps) => {
    return (
        <header className="relative z-20">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6 lg:px-8">
                <span className="text-base font-semibold tracking-[0.12em] text-foreground sm:text-lg">
                    BLUE NOTE
                </span>

                <button
                    type="button"
                    onClick={onLogin}
                    className="rounded-button border border-foreground/25 bg-background/20 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-foreground/10"
                >
                    카카오로 시작하기
                </button>
            </div>
        </header>
    );
};
