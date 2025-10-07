import React from "react";
import { cn } from "@/utils/cn";

interface TextBaseProps {
  children: React.ReactNode;
  className?: string;
}

export const Text = ({children,  className}: TextBaseProps) => {
  return (
    <span className={cn('', className)}>{children}</span>
  );
};

export const Title = ({children, className}: TextBaseProps) => {
  return (
    <Text className={cn('font-title', className)}>{children}</Text>
  );
};
