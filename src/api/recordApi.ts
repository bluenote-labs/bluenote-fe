import type {
    GeneratedRecord,
    GenerateRecordRequest,
    RecordStreamEvent,
} from "../types/record";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface GenerateRecordOptions {
    signal?: AbortSignal;
    onEvent?: (event: RecordStreamEvent) => void;
}

export const generateRecord = async (
    request: GenerateRecordRequest,
    options: GenerateRecordOptions = {},
): Promise<GeneratedRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/records/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
        signal: options.signal,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.detail ?? "기록 정리에 실패했어요. 다시 시도해 주세요.",
        );
    }

    if (!response.body) {
        throw new Error("스트리밍 응답을 받을 수 없어요.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let title = "";
    let body = "";

    while (true) {
        const { value, done } = await reader.read();

        if (done) {
            break;
        }

        buffer += decoder.decode(value, {
            stream: true,
        });

        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
            const data = block
                .split(/\r?\n/)
                .filter((line) => line.startsWith("data:"))
                .map((line) => line.slice(5).trimStart())
                .join("\n");

            if (!data) {
                continue;
            }

            const event = JSON.parse(data) as RecordStreamEvent;

            options.onEvent?.(event);

            if (event.type === "title") {
                title = event.content;
            }

            if (event.type === "body") {
                body += event.content;
            }

            if (event.type === "done") {
                return {
                    title,
                    body,
                };
            }
        }
    }

    return {
        title,
        body,
    };
};
