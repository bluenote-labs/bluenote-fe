import type { UploadImageResponse } from "../types/upload";
import { apiClient } from "./client";

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await apiClient.post<UploadImageResponse>(
        "/api/upload",
        formData,
    );

    return response.data;
};
