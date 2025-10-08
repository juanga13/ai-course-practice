'use client';

import React, { useState } from 'react';
// import { HistoryItem } from './types';
// import { Sidebar } from "@/components/Sidebar";
import { Tabs } from '@/components/Tabs';
import Week1 from '@/exercises/week-1';
import Week2 from '@/exercises/week-2';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  // const [items, setItems] = useState<HistoryItem[]>([]);
  // const [currentId, setCurrentId] = useState<string | null>(null);
  // const [, setIsLoading] = useState(false);
  // const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('week-1');

  // const _current = useMemo(
  //   () => items.find(x => x.id === currentId) ?? null,
  //   [items, currentId]
  // );

  // function _handleFilePick() {
  //   inputRef.current?.click();
  // }

  // async function _onFilesSelected(file: File | null) {
  //   if (!file) return;
  //   const id = crypto.randomUUID();
  //   const url = URL.createObjectURL(file);
  //   const item: HistoryItem = { id, name: file.name, url, result: null };
  //   setItems(prev => [item, ...prev]);
  //   setCurrentId(id);
  //   setIsLoading(true);

  //   try {
  //     const form = new FormData();
  //     form.append('file', file);
  //     const res = await fetch('/api/analyze', { method: 'POST', body: form });
  //     const data = await res.json();

  //     setItems(prev =>
  //       prev.map(it =>
  //         it.id === id
  //           ? {
  //               ...it,
  //               result: res.ok ? data : null,
  //               error: res.ok ? null : data,
  //             }
  //           : it
  //       )
  //     );
  //   } catch (e: unknown) {
  //     setItems(prev =>
  //       prev.map(it =>
  //         it.id === id
  //           ? {
  //               ...it,
  //               result: null,
  //               error: {
  //                 error: 'image_not_supported',
  //                 reason: e instanceof Error ? e.message : 'Network error',
  //               },
  //             }
  //           : it
  //       )
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <Tabs
      items={[
        {
          active: activeTab === 'week-1',
          content: <Week1 />,
          name: 'NBA Card Classifier',
          onClick: () => setActiveTab('week-1'),
        },
        {
          active: activeTab === 'week-2',
          content: <Week2 />,
          name: 'RAG Card Search',
          onClick: () => setActiveTab('week-2'),
        },
      ]}
    />
  );
}
