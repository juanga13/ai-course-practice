"use client";

import { HistoryItem } from "../types";

type SidebarProps = {
  items: HistoryItem[];
  currentId: string | null;
  onSelect: (id: string) => void;
};

export default function Sidebar({ items, currentId, onSelect }: SidebarProps) {
  return (
    <aside className="w-[300px] shrink-0 bg-background p-2">
      <ul className="w-full overflow-y-scroll bg-white shadow-sidebar">
        <li className="win95-titlebar">
          <span className="win95-titlebar-text">My First VB4 Program</span>
        </li>
        <li className="win95-title px-2 py-1">
          Chat History
        </li>
        {items.map((it) => (
          <li key={it.id}>
            <button
              onClick={() => onSelect(it.id)}
              className={`w-full text-left px-2 py-2 rounded border ${currentId === it.id ? "bg-gray-50" : "bg-white"}`}
            >
              <div className="truncate text-sm">{it.name}</div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}


