import type {
    GeneratedRecord,
    GenerateRecordRequest,
    RecordStreamEvent,
    RecordDetailResponse,
    GetRecordsParams,
    RecordListResponse,
} from "../types/record";
import type {
    CreateRecordRequest,
    CreateRecordResponse,
} from "../types/record";
import { apiClient } from "./client";
import { parseRecordStream } from "./stream/recordStreamParser";

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

    return parseRecordStream(response, options.onEvent);
};

export const createRecord = async (
    request: CreateRecordRequest,
): Promise<CreateRecordResponse> => {
    const response = await apiClient.post<CreateRecordResponse>(
        "/api/records",
        request,
    );

    return response.data;
};

export const getRecordDetail = async (
    recordId: string,
    signal?: AbortSignal,
): Promise<RecordDetailResponse> => {
    const response = await apiClient.get<RecordDetailResponse>(
        `/api/records/${recordId}`,
        {
            signal,
        },
    );

    return response.data;
};

export const getRecords = async (
    params: GetRecordsParams = {},
    signal?: AbortSignal,
): Promise<RecordListResponse> => {
    const response = await apiClient.get<RecordListResponse>("/api/records", {
        params: {
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            month: params.month,
        },
        signal,
    });

    return response.data;
};
