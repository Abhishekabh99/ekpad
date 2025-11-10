"use client";

import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const realtimeClient =
  typeof window === "undefined" || !url || !anonKey
    ? null
    : createClient<Database>(url, anonKey, {
        realtime: { params: { eventsPerSecond: 3 } }
      });

export type TypingPayload = {
  thread_id: string;
  user_id: string;
  handle?: string | null;
};

type ThreadChannelOptions = {
  onMessage?: (payload: Database["public"]["Tables"]["messages"]["Row"]) => void;
  onTyping?: (payload: TypingPayload) => void;
};

export function joinThreadChannel(threadId: string, opts: ThreadChannelOptions = {}) {
  if (!realtimeClient) return null;

  const channel = realtimeClient.channel(`thread:${threadId}`, {
    config: { broadcast: { ack: true } }
  });

  if (opts.onMessage) {
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `thread_id=eq.${threadId}`
      },
      (payload) => {
        opts.onMessage?.(payload.new as Database["public"]["Tables"]["messages"]["Row"]);
      }
    );
  }

  if (opts.onTyping) {
    channel.on("broadcast", { event: "typing" }, (payload) => {
      opts.onTyping?.(payload.payload as TypingPayload);
    });
  }

  channel.subscribe();
  return channel;
}

export function sendTyping(channel: RealtimeChannel | null, payload: TypingPayload) {
  channel?.send({
    type: "broadcast",
    event: "typing",
    payload
  });
}
