import { getServerClient } from "@/lib/supabase/server";

export const fetchThreadsForUser = async (userId: string) => {
  const supabase = getServerClient();

  const { data: participants = [] } = await supabase
    .from("thread_participants")
    .select("thread_id, last_read_msg_id, threads ( id, created_at )")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  const threadIds = participants.map((p) => p.thread_id);
  if (!threadIds.length) return [];

  const { data: latestMessages = [] } = await supabase
    .from("messages")
    .select("*")
    .in("thread_id", threadIds)
    .order("created_at", { ascending: false });

  const latestByThread = new Map<string, (typeof latestMessages)[number]>();
  for (const message of latestMessages) {
    if (!latestByThread.has(message.thread_id)) {
      latestByThread.set(message.thread_id, message);
    }
  }

  return participants.map((participant) => ({
    thread_id: participant.thread_id,
    last_read_msg_id: participant.last_read_msg_id,
    thread: participant.threads,
    last_message: latestByThread.get(participant.thread_id) ?? null
  }));
};

export const fetchThreadWithMessages = async (threadId: string, userId: string) => {
  const supabase = getServerClient();

  const { data: participant, error } = await supabase
    .from("thread_participants")
    .select("thread_id")
    .eq("thread_id", threadId)
    .eq("user_id", userId)
    .single();

  if (error || !participant) {
    return null;
  }

  const { data: messages = [] } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: false })
    .limit(50);

  return messages.reverse();
};
