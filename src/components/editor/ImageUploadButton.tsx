import type { Editor } from "@tiptap/react";
import axios from "axios";
import { useRef, useState, type ChangeEvent } from "react";

import { uploadImage } from "../../api/uploadApi";

interface ImageUploadButtonProps {
    editor: Editor;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ImageUploadButton = ({ editor }: ImageUploadButtonProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return;
        }

        if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            setErrorMessage("jpg, png, webp 이미지만 올릴 수 있어요.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setErrorMessage("파일 크기는 5MB 이하여야 해요.");
            return;
        }

        setIsUploading(true);
        setErrorMessage("");

        try {
            const { imageUrl } = await uploadImage(file);

            editor
                .chain()
                .focus()
                .setImage({
                    src: imageUrl,
                    alt: file.name,
                })
                .run();
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                setErrorMessage(
                    error.response?.data?.detail ??
                        "이미지 업로드에 실패했어요.",
                );
                return;
            }

            setErrorMessage("잠시 후 다시 시도해 주세요.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
            />

            <button
                type="button"
                onClick={handleButtonClick}
                disabled={isUploading}
                className="rounded-button px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-body disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isUploading ? "이미지 올리는 중..." : "이미지"}
            </button>

            {errorMessage && (
                <p role="alert" className="mt-2 text-xs text-error">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};
