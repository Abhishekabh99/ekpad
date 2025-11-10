import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

type Body = {
  threadId: string;
  body: string;
  attachments?: unknown[];
};

export async function POST(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId, body, attachments = [] }: Body = await request.json();
  if (!threadId || !body?.trim()) {
    return NextResponse.json({ error: "Message body required" }, { status: 400 });
  }

  const { data: participant } = await supabase
    .from("thread_participants")
    .select("thread_id")
    .eq("thread_id", threadId)
    .eq("user_id", user.id)
    .single();

  if (!participant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: user.id,
      body: body.trim(),
      attachments
    })
    .select("*")
    .single();

  if (error || !message) {
    return NextResponse.json({ error: error?.message ?? "Unable to send" }, { status: 400 });
  }

  await supabase
    .from("thread_participants")
    .update({ last_read_msg_id: message.id })
    .eq("thread_id", threadId)
    .eq("user_id", user.id);

  return NextResponse.json({ message });
}
