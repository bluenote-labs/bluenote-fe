import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecords } from "../api/recordApi";
import { RecordCard } from "../components/record/RecordCard";
import type { RecordListItem, RecordListResponse } from "../types/record";
import { RecordCalendar } from "../components/record/RecordCalendar";

const PAGE_SIZE = 10;
type RecordsView = "gallery" | "calendar";
const formatMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
};

export const RecordsPage = () => {
    const [records, setRecords] = useState<RecordListItem[]>([]);
    const [pagination, setPagination] = useState<RecordListResponse | null>(
        null,
    );

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [view, setView] = useState<RecordsView>("gallery");
    const [selectedMonth, setSelectedMonth] = useState(() => new Date());

    const handleViewChange = (nextView: RecordsView) => {
        if (nextView === view) {
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setView(nextView);
    };

    useEffect(() => {
        const controller = new AbortController();

        const loadRecords = async () => {
            try {
                const result = await getRecords(
                    view === "calendar"
                        ? {
                              page: 1,
                              limit: 31,
                              month: formatMonth(selectedMonth),
                          }
                        : {
                              page,
                              limit: PAGE_SIZE,
                          },
                    controller.signal,
                );

                setRecords(result.records);
                setPagination(result);
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

        void loadRecords();

        return () => {
            controller.abort();
        };
    }, [page, view, selectedMonth]);

    const handlePreviousPage = () => {
        if (page <= 1) {
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setPage((currentPage) => currentPage - 1);
    };

    const handleNextPage = () => {
        if (!pagination?.hasNext) {
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setPage((currentPage) => currentPage + 1);
    };

    if (isLoading) {
        return (
            <main className="flex min-h-full items-center justify-center">
                <p className="text-sm text-muted">기록을 불러오고 있어요...</p>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="flex min-h-full items-center justify-center px-5">
                <p className="text-foreground">{errorMessage}</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
            <header className="flex items-end justify-between gap-5">
                <div>
                    <p className="text-sm font-medium text-moonlight">
                        나의 글
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold text-foreground">
                        내가 남긴 기록
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        {view === "calendar"
                            ? `${selectedMonth.getFullYear()}년 ${
                                  selectedMonth.getMonth() + 1
                              }월에는 ${pagination?.total ?? 0}개의 기록을 남겼어요.`
                            : `지금까지 ${pagination?.total ?? 0}개의 기록을 남겼어요.`}
                    </p>
                </div>

                <Link
                    to="/write"
                    className="shrink-0 rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary-hover"
                >
                    오늘 이야기하기
                </Link>
            </header>

            <div className="mt-8 flex border-b border-divider">
                <button
                    type="button"
                    onClick={() => handleViewChange("gallery")}
                    className={`border-b-2 px-4 py-3 text-sm ${
                        view === "gallery"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted"
                    }`}
                >
                    사진 모아보기
                </button>

                <button
                    type="button"
                    onClick={() => handleViewChange("calendar")}
                    className={`border-b-2 px-4 py-3 text-sm ${
                        view === "calendar"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted"
                    }`}
                >
                    달력으로 보기
                </button>
            </div>

            {view === "calendar" ? (
                <RecordCalendar
                    records={records}
                    selectedMonth={selectedMonth}
                    onPreviousMonth={() => {
                        setIsLoading(true);
                        setErrorMessage("");

                        setSelectedMonth(
                            (currentMonth) =>
                                new Date(
                                    currentMonth.getFullYear(),
                                    currentMonth.getMonth() - 1,
                                    1,
                                ),
                        );
                    }}
                    onNextMonth={() => {
                        setIsLoading(true);
                        setErrorMessage("");

                        setSelectedMonth(
                            (currentMonth) =>
                                new Date(
                                    currentMonth.getFullYear(),
                                    currentMonth.getMonth() + 1,
                                    1,
                                ),
                        );
                    }}
                />
            ) : records.length === 0 ? (
                <section className="mt-16 rounded-card border border-border bg-surface px-5 py-16 text-center">
                    <p className="text-lg font-medium text-foreground">
                        아직 남긴 기록이 없어요.
                    </p>

                    <p className="mt-2 text-sm text-muted">
                        오늘의 이야기를 편하게 남겨보세요.
                    </p>

                    <Link
                        to="/write"
                        className="mt-6 inline-block rounded-button bg-primary px-5 py-3 text-sm font-medium text-foreground"
                    >
                        첫 기록 남기기
                    </Link>
                </section>
            ) : (
                <>
                    <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {records.map((record) => (
                            <RecordCard key={record.id} record={record} />
                        ))}
                    </section>

                    <nav
                        aria-label="기록 목록 페이지"
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={page <= 1}
                            className="rounded-button border border-border px-4 py-2 text-sm text-body disabled:cursor-not-allowed disabled:text-disabled"
                        >
                            이전
                        </button>

                        <span className="text-sm text-muted">
                            {page} / {pagination?.totalPages ?? 1}
                        </span>

                        <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={!pagination?.hasNext}
                            className="rounded-button border border-border px-4 py-2 text-sm text-body disabled:cursor-not-allowed disabled:text-disabled"
                        >
                            다음
                        </button>
                    </nav>
                </>
            )}
        </main>
    );
};
