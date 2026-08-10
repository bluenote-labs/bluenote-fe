import type { RecordDraft } from "../types/record";

const RECORD_DRAFT_KEY = "recordDraft";

export const recordDraftStorage = {
    get: (): RecordDraft | null => {
        const storedDraft = sessionStorage.getItem(RECORD_DRAFT_KEY);

        if (!storedDraft) {
            return null;
        }

        try {
            return JSON.parse(storedDraft) as RecordDraft;
        } catch {
            sessionStorage.removeItem(RECORD_DRAFT_KEY);
            return null;
        }
    },

    set: (draft: RecordDraft) => {
        sessionStorage.setItem(RECORD_DRAFT_KEY, JSON.stringify(draft));
    },

    remove: () => {
        sessionStorage.removeItem(RECORD_DRAFT_KEY);
    },
};
