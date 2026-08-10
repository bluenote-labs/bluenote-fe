import type { JSONContent } from "@tiptap/core";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RecordEditorProps {
    initialContent: string | JSONContent;
    onChange: (content: JSONContent) => void;
}

export const RecordEditor = ({
    initialContent,
    onChange,
}: RecordEditorProps) => {
    const isMarkdown = typeof initialContent === "string";

    const editor = useEditor({
        extensions: [StarterKit, Markdown],
        content: initialContent,
        contentType: isMarkdown ? "markdown" : "json",

        editorProps: {
            attributes: {
                class: [
                    "min-h-96 px-5 py-4",
                    "text-sm leading-7 text-body",
                    "focus:outline-none",
                    "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-2xl",
                    "[&_h1]:font-semibold [&_h1]:text-foreground",
                    "[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl",
                    "[&_h2]:font-semibold [&_h2]:text-foreground",
                    "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg",
                    "[&_p]:my-3",
                    "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
                    "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
                    "[&_blockquote]:my-4",
                    "[&_blockquote]:border-l-2",
                    "[&_blockquote]:border-primary",
                    "[&_blockquote]:pl-4",
                    "[&_blockquote]:text-muted",
                ].join(" "),
            },
        },

        onCreate: ({ editor }) => {
            onChange(editor.getJSON());
        },

        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-card border border-border bg-background/60">
            <div className="flex flex-wrap gap-1 border-b border-divider p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`rounded-button px-3 py-2 text-sm ${
                        editor.isActive("bold")
                            ? "bg-primary-subtle text-foreground"
                            : "text-muted hover:bg-surface-hover"
                    }`}
                >
                    굵게
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`rounded-button px-3 py-2 text-sm ${
                        editor.isActive("heading", {
                            level: 2,
                        })
                            ? "bg-primary-subtle text-foreground"
                            : "text-muted hover:bg-surface-hover"
                    }`}
                >
                    제목
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`rounded-button px-3 py-2 text-sm ${
                        editor.isActive("bulletList")
                            ? "bg-primary-subtle text-foreground"
                            : "text-muted hover:bg-surface-hover"
                    }`}
                >
                    목록
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={`rounded-button px-3 py-2 text-sm ${
                        editor.isActive("blockquote")
                            ? "bg-primary-subtle text-foreground"
                            : "text-muted hover:bg-surface-hover"
                    }`}
                >
                    인용
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
};
