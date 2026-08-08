function App() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
            <section className="w-full max-w-md rounded-card border border-border bg-surface p-6 sm:p-8">
                <span className="text-sm font-medium text-moonlight">
                    오늘의 기록
                </span>

                <h1 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
                    오늘 하루는 어땠어요?
                </h1>

                <p className="mt-3 text-sm font-normal leading-7 text-muted sm:text-base">
                    정리되지 않아도 괜찮습니다.
                    <br />
                    오늘 있었던 일을 편하게 남겨보세요.
                </p>

                <button
                    type="button"
                    className="
            mt-8 w-full rounded-button bg-primary px-5 py-3
            font-medium text-foreground transition-colors
            hover:bg-primary-hover
            active:bg-primary-pressed
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
            focus-visible:ring-offset-2
            focus-visible:ring-offset-surface
          "
                >
                    오늘 이야기하기
                </button>
            </section>
        </main>
    );
}

export default App;
