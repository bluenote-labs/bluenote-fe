import { Link } from "react-router-dom";

import type { RecordListItem } from "../../types/record";

interface RecordCardProps {
    record: RecordListItem;
}

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
    }).format(new Date(`${date}T00:00:00`));
};

export const RecordCard = ({ record }: RecordCardProps) => {
    return (
        <Link
            to={`/records/${record.id}`}
            className="group overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-primary/60"
        >
            {record.imageUrl ? (
                <div className="aspect-[4/3] overflow-hidden bg-surface-secondary">
                    <img
                        src={record.imageUrl}
                        alt={`${record.title} 기록 이미지`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                </div>
            ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-surface-secondary px-7">
                    <p className="line-clamp-4 text-center text-lg leading-8 font-medium text-foreground">
                        {record.title}
                    </p>
                </div>
            )}

            <div className="p-5">
                <time dateTime={record.date} className="text-xs text-moonlight">
                    {formatDate(record.date)}
                </time>

                {record.imageUrl && (
                    <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">
                        {record.title}
                    </h2>
                )}

                {record.goals.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {record.goals.map((goal) => (
                            <span
                                key={goal.id}
                                className="rounded-full border border-sage/30 bg-sage/10 px-2.5 py-1 text-xs text-sage"
                            >
                                {goal.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};
