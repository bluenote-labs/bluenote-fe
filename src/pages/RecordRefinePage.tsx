import type { JSONContent } from "@tiptap/core";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { RecordEditor } from "../components/editor/RecordEditor";
import { recordDraftStorage } from "../utils/recordDraftStorage";
import axios from "axios";
import { createRecord } from "../api/recordApi";

export const RecordRefinePage = () => {
    const navigate = useNavigate();
    const [initialDraft] = useState(() => {
        return recordDraftStorage.get();
    });
    const [title, setTitle] = useState(initialDraft?.title ?? "");
    const [content, setContent] = useState<JSONContent | null>(
        initialDraft?.content ?? null,
    );
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextTitle = event.target.value;

        setTitle(nextTitle);

        if (!initialDraft) {
            return;
        }

        recordDraftStorage.set({
            ...initialDraft,
            title: nextTitle,
            content: content ?? initialDraft.content,
        });
    };

    const handleContentChange = (nextContent: JSONContent) => {
        setContent(nextContent);

        if (!initialDraft) {
            return;
        }

        recordDraftStorage.set({
            ...initialDraft,
            title,
            content: nextContent,
        });
    };

    const handleSave = async () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setErrorMessage("제목을 입력해 주세요.");
            return;
        }

        if (!content) {
            setErrorMessage("기록할 내용을 입력해 주세요.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            const savedRecord = await createRecord({
                title: trimmedTitle,
                content,
            });

            recordDraftStorage.remove();

            navigate(`/records/${savedRecord.id}`, {
                replace: true,
            });
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                setErrorMessage(
                    error.response?.data?.detail ?? "기록 저장에 실패했어요.",
                );
                return;
            }

            setErrorMessage("잠시 후 다시 시도해 주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!initialDraft) {
        return (
            <main className="flex min-h-full items-center justify-center px-5">
                <div className="text-center">
                    <p className="text-foreground">다듬을 기록이 없어요.</p>

                    <button
                        type="button"
                        onClick={() => navigate("/write")}
                        className="mt-5 rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground"
                    >
                        오늘 이야기하기
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-6">
            <header>
                <p className="text-sm font-medium text-moonlight">
                    기록 다듬기
                </p>

                <h1 className="mt-2 text-2xl font-semibold text-foreground">
                    오늘의 기록을 내 언어로 다듬어보세요.
                </h1>

                <p className="mt-2 text-sm text-muted">
                    AI가 정리한 초안입니다. 자유롭게 수정할 수 있어요.
                </p>
            </header>

            <section className="mt-8 rounded-card border border-border bg-surface/80 p-5 sm:p-7">
                <label
                    htmlFor="record-title"
                    className="text-sm font-medium text-muted"
                >
                    제목
                </label>

                <input
                    id="record-title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="mt-2 w-full border-b border-divider bg-transparent pb-3 text-xl font-semibold text-foreground focus:border-primary focus:outline-none"
                />

                <div className="mt-6">
                    <p className="mb-2 text-sm font-medium text-muted">본문</p>

                    <RecordEditor
                        initialContent={
                            initialDraft.content ??
                            initialDraft.body ?? {
                                type: "doc",
                                content: [
                                    {
                                        type: "paragraph",
                                    },
                                ],
                            }
                        }
                        onChange={handleContentChange}
                    />
                </div>

                {errorMessage && (
                    <p role="alert" className="mt-4 text-sm text-error">
                        {errorMessage}
                    </p>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !title.trim() || !content}
                        className="rounded-button bg-primary px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary-hover active:bg-primary-pressed disabled:cursor-not-allowed disabled:bg-disabled"
                    >
                        {isSaving
                            ? "기록을 저장하고 있어요..."
                            : "기록 저장하기"}
                    </button>
                </div>
            </section>
        </main>
    );
};
