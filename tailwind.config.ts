import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        "rw-bg": "#0f1020",
        "rw-surface": "#1a1b3a",
        "rw-surface-2": "#242554",
        "rw-text": "#f5f6ff",
        "rw-accent": "#ff2da8",
        "rw-accent-2": "#20f3ff",
        "rw-accent-3": "#8a2eff",
        "win98-light": "#ffffff",
        "win98-dark": "#4d4d4d",
        "win98-shadow": "#000000",
        "win98-highlight": "#c0c0c0",
        "background": "#dfdfdf",
      },
      boxShadow: {
        win98: "1px 1px 0 0 #000000, -1px -1px 0 0 #ffffff",
        "win98-inset": "inset 1px 1px 0 0 #000000, inset -1px -1px 0 0 #ffffff",
        sidebar: 'inset -1px -1px 0 0 #fff, inset 1px 1px 0 0 grey, inset -2px -2px 0 0 #dfdfdf, inset 2px 2px 0 0 #0a0a0a',

      },
    },
  },
} satisfies Config;


