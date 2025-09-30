import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

export function Panel({ className, ...props }: Props) {
  return <div className={`win98-panel rounded ${className || ""}`} {...props} />;
}

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`win98-separator ${className || ""}`} {...props} />;
}


