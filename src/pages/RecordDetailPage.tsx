import { useParams } from "react-router-dom";

export const RecordDetailPage = () => {
    const { recordId } = useParams<{ recordId: string }>();

    return (
        <div>
            <h1 className="text-2xl font-semibold text-foreground">
                기록 상세
            </h1>

            <p className="mt-2 text-muted">기록 ID: {recordId}</p>
        </div>
    );
};
