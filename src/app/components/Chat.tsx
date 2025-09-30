"use client";

import { HistoryItem } from "../types";

type ChatProps = {
  item: HistoryItem | null;
  isLoading: boolean;
  onPickFile: () => void;
  onFileSelected: (file: File | null) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function Chat({ item, isLoading, onPickFile, onFileSelected, inputRef }: ChatProps) {
  if (!item) {
    return (
      <div className="mx-auto max-w-xl">
        <div
          className="border border-gray-200 rounded-lg p-8 text-center bg-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0] ?? null;
            if (f) onFileSelected(f);
          }}
        >
          <p className="mb-4">Drag & drop an image or PDF</p>
          <div className="flex items-center justify-center gap-3">
            <button className="border px-4 py-2 rounded" onClick={onPickFile}>
              Upload
            </button>
            <span className="text-gray-400 text-sm">or</span>
            <button className="border px-3 py-2 rounded" onClick={onPickFile}>
              Choose file
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            hidden
            onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="border rounded-lg p-3">
        <div className="mb-3 text-sm text-gray-600">Input</div>
        {item.url.endsWith("pdf") ? (
          <div className="text-sm">PDF uploaded: {item.name}</div>
        ) : (
          <img src={item.url} alt={item.name} className="max-h-72 object-contain mx-auto" />
        )}
      </div>
      <div className="border rounded-lg p-4 min-h-24">
        {isLoading ? (
          <div>Loading...</div>
        ) : item.error ? (
          <div className="text-red-600 text-sm">{item.error.reason}</div>
        ) : item.result ? (
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(item.result, null, 2)}</pre>
        ) : (
          <div className="text-sm text-gray-600">No result</div>
        )}
      </div>
    </div>
  );
}


