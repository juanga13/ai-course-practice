"use client";

import { ReactNode } from "react";

type WindowProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Window({ title, actions, children, className }: WindowProps) {
  return (
    <div className={`win98-window rounded ${className || ""}`}>
      <div className="win98-titlebar">
        <span>{title}</span>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="win98-window-content">{children}</div>
    </div>
  );
}


