import type { GuestRecordDraft } from "../types/record";

const GUEST_RECORD_KEY = "guestRecordDraft";

export const guestRecordStorage = {
    get: (): GuestRecordDraft | null => {
        const storedDraft = sessionStorage.getItem(GUEST_RECORD_KEY);

        if (!storedDraft) {
            return null;
        }

        try {
            return JSON.parse(storedDraft) as GuestRecordDraft;
        } catch {
            sessionStorage.removeItem(GUEST_RECORD_KEY);
            return null;
        }
    },

    set: (draft: GuestRecordDraft) => {
        sessionStorage.setItem(GUEST_RECORD_KEY, JSON.stringify(draft));
    },

    remove: () => {
        sessionStorage.removeItem(GUEST_RECORD_KEY);
    },
};
