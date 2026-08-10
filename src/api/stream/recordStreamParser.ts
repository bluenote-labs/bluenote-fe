import type { GeneratedRecord, RecordStreamEvent } from "../../types/record";

export const parseRecordStream = async (
    response: Response,
    onEvent?: (event: RecordStreamEvent) => void,
): Promise<GeneratedRecord> => {
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

            onEvent?.(event);

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
