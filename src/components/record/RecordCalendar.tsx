import { Link } from "react-router-dom";
import type { RecordListItem } from "../../types/record";

interface RecordCalendarProps {
    records: RecordListItem[];
    selectedMonth: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const formatDateKey = (year: number, month: number, day: number) => {
    return [
        year,
        String(month + 1).padStart(2, "0"),
        String(day).padStart(2, "0"),
    ].join("-");
};

export const RecordCalendar = ({
    records,
    selectedMonth,
    onPreviousMonth,
    onNextMonth,
}: RecordCalendarProps) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const recordMap = new Map(records.map((record) => [record.date, record]));

    const calendarDays: Array<number | null> = [
        ...Array.from<null>({
            length: firstDay,
        }).fill(null),

        ...Array.from(
            {
                length: daysInMonth,
            },
            (_, index) => index + 1,
        ),
    ];

    return (
        <section className="mt-8">
            <header className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onPreviousMonth}
                    className="rounded-button border border-border px-4 py-2 text-sm text-body hover:bg-surface-hover"
                    aria-label="이전 달"
                >
                    ←
                </button>

                <h2 className="text-xl font-semibold text-foreground">
                    {year}년 {month + 1}월
                </h2>

                <button
                    type="button"
                    onClick={onNextMonth}
                    className="rounded-button border border-border px-4 py-2 text-sm text-body hover:bg-surface-hover"
                    aria-label="다음 달"
                >
                    →
                </button>
            </header>

            <div className="mt-5 overflow-x-auto">
                <div className="min-w-[44rem] overflow-hidden rounded-card border border-border bg-surface">
                    <div className="grid grid-cols-7 border-b border-divider">
                        {WEEKDAYS.map((weekday, index) => (
                            <div
                                key={weekday}
                                className={`px-3 py-3 text-center text-xs ${
                                    index === 0
                                        ? "text-error"
                                        : index === 6
                                          ? "text-moonlight"
                                          : "text-muted"
                                }`}
                            >
                                {weekday}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="min-h-32 border-r border-b border-divider/70 bg-background/20"
                                    />
                                );
                            }

                            const dateKey = formatDateKey(year, month, day);

                            const record = recordMap.get(dateKey);

                            return (
                                <div
                                    key={dateKey}
                                    className="min-h-32 border-r border-b border-divider/70 p-2"
                                >
                                    <span className="text-xs text-muted">
                                        {day}
                                    </span>

                                    {record && (
                                        <Link
                                            to={`/records/${record.id}`}
                                            className="mt-2 block overflow-hidden rounded-button bg-surface-secondary transition-colors hover:bg-surface-hover"
                                        >
                                            {record.imageUrl && (
                                                <img
                                                    src={record.imageUrl}
                                                    alt=""
                                                    loading="lazy"
                                                    className="h-16 w-full object-cover"
                                                />
                                            )}

                                            <p className="line-clamp-2 px-2 py-2 text-xs leading-5 text-foreground">
                                                {record.title}
                                            </p>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
