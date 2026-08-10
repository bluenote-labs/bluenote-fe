import type { JSONContent } from "@tiptap/core";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { generateRecord } from "../api/recordApi";
import { recordDraftStorage } from "../utils/recordDraftStorage";

const EMPTY_DOCUMENT: JSONContent = {
    type: "doc",
    content: [
        {
            type: "paragraph",
        },
    ],
};

export const RecordWritePage = () => {
    const navigate = useNavigate();
    const abortControllerRef = useRef<AbortController | null>(null);

    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedInput = input.trim();

        if (!trimmedInput || isGenerating) {
            return;
        }

        const controller = new AbortController();

        abortControllerRef.current?.abort();
        abortControllerRef.current = controller;

        setIsGenerating(true);
        setErrorMessage("");

        try {
            const generatedRecord = await generateRecord(
                {
                    input: trimmedInput,
                },
                {
                    signal: controller.signal,
                },
            );

            recordDraftStorage.set({
                source: "ai",
                input: trimmedInput,
                title: generatedRecord.title,
                body: generatedRecord.body,
            });

            navigate("/write/refine");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "기록 정리에 실패했어요.",
            );
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
                setIsGenerating(false);
            }
        }
    };

    const handleDirectWrite = () => {
        recordDraftStorage.set({
            source: "direct",
            title: "",
            content: EMPTY_DOCUMENT,
        });

        navigate("/write/refine");
    };

    return (
        <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6">
            <header>
                <p className="text-sm font-medium text-moonlight">
                    오늘 이야기하기
                </p>

                <h1 className="mt-2 text-3xl font-semibold text-foreground">
                    오늘 하루는 어땠어요?
                </h1>

                <p className="mt-3 text-sm leading-7 text-muted">
                    순서나 문장을 고민하지 않아도 괜찮아요. 떠오르는 대로 편하게
                    적어보세요.
                </p>
            </header>

            <form
                onSubmit={handleGenerate}
                className="mt-8 rounded-card border border-border bg-surface/80 p-5 sm:p-7"
            >
                <label
                    htmlFor="record-input"
                    className="text-sm font-medium text-foreground"
                >
                    오늘의 이야기
                </label>

                <textarea
                    id="record-input"
                    value={input}
                    onChange={handleInputChange}
                    disabled={isGenerating}
                    rows={12}
                    placeholder="오늘 있었던 일과 떠오른 생각을 편하게 적어보세요."
                    className="mt-3 w-full resize-y rounded-button border border-border bg-background/60 px-4 py-4 text-sm leading-7 text-body placeholder:text-muted focus:border-primary focus:outline-none disabled:opacity-60"
                />

                {errorMessage && (
                    <p role="alert" className="mt-3 text-sm text-error">
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!input.trim() || isGenerating}
                    className="mt-5 w-full rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary-hover active:bg-primary-pressed disabled:cursor-not-allowed disabled:bg-disabled"
                >
                    {isGenerating
                        ? "내 기록으로 정리하고 있어요..."
                        : "내 기록으로 정리하기"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-muted">
                    AI의 도움 없이 처음부터 직접 쓰고 싶나요?
                </p>

                <button
                    type="button"
                    onClick={handleDirectWrite}
                    disabled={isGenerating}
                    className="mt-2 text-sm font-medium text-body underline decoration-divider underline-offset-4 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:text-disabled"
                >
                    직접 작성할게요
                </button>
            </div>
        </main>
    );
};
