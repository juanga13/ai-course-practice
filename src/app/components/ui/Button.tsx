"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "accent";
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "default", className, children, ...props },
  ref,
) {
  const variantClass =
    variant === "accent"
      ? "bg-rw-accent text-black"
      : "bg-rw-surface-2 text-rw-text";

  return (
    <button
      ref={ref}
      className={`win98-button ${variantClass} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;


