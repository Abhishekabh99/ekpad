"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState, useTransition } from "react";

import type { Database } from "@/lib/database.types";
import { joinThreadChannel, sendTyping } from "@/lib/realtime";
import { useTypingStore } from "@/lib/stores/typing-store";
import { cn } from "@/lib/utils";

type Message = Database["public"]["Tables"]["messages"]["Row"];

type ThreadClientProps = {
  threadId: string;
  viewerId: string;
  viewerHandle: string | null;
  initialMessages: Message[];
};

export function ThreadClient({ threadId, viewerId, viewerHandle, initialMessages }: ThreadClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [isSending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastMessage = messages.at(-1) ?? null;
  const typingStore = useTypingStore();

  useEffect(() => {
    const channel = joinThreadChannel(threadId, {
      onMessage: (payload) => {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === payload.id);
          if (exists) return prev;
          return [...prev, payload];
        });
      },
      onTyping: (payload) => {
        if (payload.thread_id === threadId) {
          typingStore.setTyping(threadId, payload.handle ?? null);
        }
      }
    });
    channelRef.current = channel;

    return () => {
      channel?.unsubscribe();
      channelRef.current = null;
    };
  }, [threadId, typingStore]);

  useEffect(() => {
    typingStore.prune();
    const id = setInterval(() => typingStore.prune(), 1000);
    return () => clearInterval(id);
  }, [typingStore]);

  useEffect(() => {
    if (!lastMessage || lastMessage.sender_id === viewerId) return;
    fetch("/api/dm/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, messageId: lastMessage.id })
    }).catch(() => undefined);
  }, [lastMessage?.id, lastMessage?.sender_id, threadId, viewerId]);

  useEffect(() => {
    containerRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const typingHandle = typingStore.entries[threadId]?.handle;

  const handleSubmit = () => {
    const payload = body.trim();
    if (!payload) return;
    setBody("");

    startTransition(async () => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, body: payload })
      });
      if (!res.ok) {
        setBody(payload);
        return;
      }
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No messages yet — say hi.</p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender_id === viewerId ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-sm rounded-2xl px-4 py-2 text-sm shadow-sm",
                message.sender_id === viewerId
                  ? "bg-brand-purple/60 text-white"
                  : "bg-muted/70 text-foreground"
              )}
            >
              <p>{message.body}</p>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-white/60">
                {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        {typingHandle && (
          <span className="text-xs text-brand-cyan">{typingHandle} is typing…</span>
        )}
      </div>
      <div className="border-t border-white/5 p-4">
        <textarea
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-brand-cyan/60"
          rows={2}
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            sendTyping(channelRef.current, {
              thread_id: threadId,
              user_id: viewerId,
              handle: viewerHandle ?? undefined
            });
          }}
          placeholder="Drop a message"
        />
        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSending}
            onClick={handleSubmit}
            className="rounded-lg bg-brand-cyan px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
