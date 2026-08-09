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
    body: string;
}
