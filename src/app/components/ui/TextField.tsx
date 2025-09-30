"use client";

import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, className, id, ...props },
  ref,
) {
  const inputId = id || props.name || Math.random().toString(36).slice(2);
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-xs text-[color:var(--rw-text)]/80">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        ref={ref}
        className={`win98-input rounded ${className || ""}`}
        {...props}
      />
    </div>
  );
});

export default TextField;


