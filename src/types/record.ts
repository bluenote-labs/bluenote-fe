import type { JSONContent } from "@tiptap/core";

export interface GenerateRecordRequest {
    input: string;
}

export interface GeneratedRecord {
    title: string;
    body: string;
}

export type RecordStreamEvent =
    | {
          type: "title";
          content: string;
      }
    | {
          type: "body";
          content: string;
      }
    | {
          type: "done";
      };

export type RecordDraftSource = "guest-ai" | "ai" | "direct";

export interface RecordDraft {
    source: RecordDraftSource;
    input?: string;
    title: string;
    body?: string;
    content?: JSONContent;
}

export interface CreateRecordRequest {
    title: string;
    content: JSONContent;
}

export interface CreateRecordResponse {
    id: string;
    date: string;
    title: string;
    createdAt: string;
}

export interface RecordGoal {
    id: string;
    title: string;
}

export interface RecordDetailResponse {
    id: string;
    date: string;
    title: string;
    content: JSONContent;
    imageUrl: string | null;
    goals: RecordGoal[];
    createdAt: string;
    updatedAt: string;
}

export interface RecordListItem {
    id: string;
    date: string;
    title: string;
    imageUrl: string | null;
    goals: RecordGoal[];
    createdAt: string;
}

export interface RecordListResponse {
    records: RecordListItem[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
}

export interface GetRecordsParams {
    page?: number;
    limit?: number;
    month?: string;
}
