interface GuestRecordResultProps {
    title: string;
    body: string;
    isLoading: boolean;
    onTitleChange: (title: string) => void;
    onBodyChange: (body: string) => void;
    onLogin: () => void;
}

export const GuestRecordResult = ({
    title,
    body,
    isLoading,
    onTitleChange,
    onBodyChange,
    onLogin,
}: GuestRecordResultProps) => {
    return (
        <section className="mt-5 rounded-card border border-foreground/15 bg-background/75 p-5 backdrop-blur-md sm:p-6">
            <p className="text-sm font-medium text-moonlight">
                AI가 정리한 오늘의 기록
            </p>

            <input
                type="text"
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                disabled={isLoading}
                aria-label="기록 제목"
                className="mt-4 w-full border-b border-divider bg-transparent pb-3 text-lg font-semibold text-foreground focus:border-primary focus:outline-none disabled:opacity-100"
            />

            <textarea
                value={body}
                onChange={(event) => onBodyChange(event.target.value)}
                disabled={isLoading}
                aria-label="기록 본문"
                rows={8}
                className="mt-4 w-full resize-none rounded-button border border-border bg-surface/60 px-4 py-3 text-sm leading-7 text-body focus:border-primary focus:outline-none disabled:opacity-100"
            />

            {isLoading ? (
                <p className="mt-3 text-sm text-muted">
                    내 언어로 기록을 정리하고 있어요...
                </p>
            ) : (
                <div className="mt-4">
                    <p className="text-sm text-muted">
                        내용을 직접 수정할 수 있어요.
                    </p>

                    <button
                        type="button"
                        onClick={onLogin}
                        className="mt-4 w-full rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary-hover active:bg-primary-pressed"
                    >
                        카카오로 시작하고 기록 저장하기
                    </button>
                </div>
            )}
        </section>
    );
};
