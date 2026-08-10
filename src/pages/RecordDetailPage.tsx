import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getRecordDetail } from "../api/recordApi";
import { RecordEditor } from "../components/editor/RecordEditor";
import type { RecordDetailResponse } from "../types/record";

export const RecordDetailPage = () => {
    const navigate = useNavigate();
    const { recordId } = useParams<{
        recordId: string;
    }>();

    const [record, setRecord] = useState<RecordDetailResponse | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!recordId) {
            return;
        }

        const controller = new AbortController();

        const loadRecord = async () => {
            try {
                const result = await getRecordDetail(
                    recordId,
                    controller.signal,
                );

                setRecord(result);
            } catch (error) {
                if (axios.isCancel(error)) {
                    return;
                }

                if (axios.isAxiosError<{ detail: string }>(error)) {
                    setErrorMessage(
                        error.response?.data?.detail ??
                            "기록을 불러오지 못했어요.",
                    );
                    return;
                }

                setErrorMessage("잠시 후 다시 시도해 주세요.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void loadRecord();

        return () => {
            controller.abort();
        };
    }, [recordId]);

    if (!recordId) {
        return (
            <main className="flex min-h-full items-center justify-center">
                <p className="text-error">잘못된 기록 주소예요.</p>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="flex min-h-full items-center justify-center">
                <p className="text-sm text-muted">기록을 불러오고 있어요...</p>
            </main>
        );
    }

    if (errorMessage || !record) {
        return (
            <main className="flex min-h-full items-center justify-center px-5">
                <div className="text-center">
                    <p className="text-foreground">
                        {errorMessage || "기록을 찾을 수 없어요."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/records")}
                        className="mt-5 rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground"
                    >
                        나의 글로 돌아가기
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-6">
            <button
                type="button"
                onClick={() => navigate("/records")}
                className="text-sm text-muted transition-colors hover:text-body"
            >
                ← 나의 글
            </button>

            <article className="mt-7">
                <header>
                    <time
                        dateTime={record.date}
                        className="text-sm text-moonlight"
                    >
                        {record.date}
                    </time>

                    <h1 className="mt-2 text-3xl font-semibold text-foreground">
                        {record.title}
                    </h1>

                    {record.goals.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {record.goals.map((goal) => (
                                <span
                                    key={goal.id}
                                    className="rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-xs text-sage"
                                >
                                    {goal.title}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {record.imageUrl && (
                    <img
                        src={record.imageUrl}
                        alt=""
                        className="mt-7 max-h-[32rem] w-full rounded-card object-cover"
                    />
                )}

                <section className="mt-7">
                    <RecordEditor
                        initialContent={record.content}
                        editable={false}
                    />
                </section>
            </article>
        </main>
    );
};
