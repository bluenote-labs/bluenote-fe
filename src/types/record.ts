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

export interface GuestRecordDraft {
    input: string;
    title: string;
    // AI가 생성한 최초 Markdown
    body: string;
    // Tiptap에서 수정한 이후의 JSON
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
