import { useState, type FormEvent } from "react";

interface GuestRecordFormProps {
    isLoading: boolean;
    onSubmit: (content: string) => void;
}

export const GuestRecordForm = ({
    isLoading,
    onSubmit,
}: GuestRecordFormProps) => {
    const [content, setContent] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent || isLoading) {
            return;
        }

        onSubmit(trimmedContent);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-card border border-foreground/15 bg-background/70 p-5 backdrop-blur-md sm:p-6"
        >
            <label
                htmlFor="guest-record"
                className="text-sm font-medium text-foreground"
            >
                오늘 하루는 어땠어요?
            </label>

            <textarea
                id="guest-record"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={isLoading}
                placeholder="오늘 있었던 일을 편하게 적어보세요."
                rows={6}
                className="mt-3 w-full resize-none rounded-button border border-border bg-surface/70 px-4 py-3 text-sm text-body placeholder:text-muted focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={!content.trim() || isLoading}
                    className="rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary-hover active:bg-primary-pressed disabled:cursor-not-allowed disabled:bg-disabled"
                >
                    {isLoading ? "기록을 정리하고 있어요..." : "기록해보기"}
                </button>
            </div>
        </form>
    );
};
