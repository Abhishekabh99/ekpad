"use client";

import { create } from "zustand";

type TypingState = {
  entries: Record<string, { handle: string | null; expiresAt: number }>;
  setTyping: (threadId: string, handle: string | null) => void;
  prune: () => void;
};

export const useTypingStore = create<TypingState>((set, get) => ({
  entries: {},
  setTyping: (threadId, handle) =>
    set((state) => ({
      entries: {
        ...state.entries,
        [threadId]: { handle, expiresAt: Date.now() + 5000 }
      }
    })),
  prune: () =>
    set((state) => {
      const now = Date.now();
      const next: TypingState["entries"] = {};
      for (const [key, value] of Object.entries(state.entries)) {
        if (value.expiresAt > now) {
          next[key] = value;
        }
      }
      return { entries: next };
    })
}));
