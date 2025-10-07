"use client";

import React, { ReactNode } from "react";
import { Title } from "./Text"
import { cn } from "@/utils/cn";
import cursorIcon from "@/assets/Cursor active.ico";

interface TabsProps {
  items: {
    name: string;
    active: boolean;
    content: ReactNode;
    onClick: () => void;
  }[];
}

export const Tabs = (props: TabsProps) => {
  const activeContent = props.items.find((item ) => item.active)?.content || null;
  return (
    <div className="h-full w-full flex flex-col overflow-hidden win95-shadow">
      <div className="w-full win95-titlebar gap-2">
        {props.items.map((item, index) => (
          <TabItem key={index} text={item.name} active={item.active} onClick={item.onClick} />
        ))}
      </div>
      <div className="flex flex-1 bg-white">
        {activeContent}
      </div>
    </div>
  )
}

interface TabItemProps {
  text: string;
  active: boolean;
  onClick: () => void;
}

const TabItem = (props: TabItemProps) => {
  return (
    <a className={cn(
      "flex flex-row items-center gap-2",
      "win95-titlebar-text border border-transparent border-dotted",
      "select-none",
      "active:border-white active:bg-win98-blue",
      props.active ? "border-white" : ""
    )} onClick={props.onClick}>
      {props.active && <div className="">
        <img src={cursorIcon.src} alt="Cursor" className="w-4 h-4" />
      </div>}
      <Title>{props.text}</Title>
    </a>
  )
}