"use client";

import { useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { HistoryItem } from "./types";

export default function HomePage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const current = useMemo(
    () => items.find((x) => x.id === currentId) ?? null,
    [items, currentId],
  );

  function handleFilePick() {
    inputRef.current?.click();
  }

  async function onFilesSelected(file: File | null) {
    if (!file) return;
    const id = crypto.randomUUID();
    const url = URL.createObjectURL(file);
    const item: HistoryItem = { id, name: file.name, url, result: null };
    setItems((prev) => [item, ...prev]);
    setCurrentId(id);
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();

      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                result: res.ok ? data : null,
                error: res.ok ? null : data,
              }
            : it,
        ),
      );
    } catch (e: any) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                result: null,
                error: { error: "image_not_supported", reason: e?.message || "Network error" },
              }
            : it,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-row overflow-hidden">
      <Sidebar items={items} currentId={currentId} onSelect={setCurrentId} />
      {/* <main className="p-6 overflow-y-auto">
        <Chat
          item={current}
          isLoading={isLoading}
          onPickFile={handleFilePick}
          onFileSelected={onFilesSelected}
          inputRef={inputRef}
        />
      </main> */}
    </div>
  );
}


