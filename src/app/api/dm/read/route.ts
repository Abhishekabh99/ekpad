import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

type Body = {
  threadId: string;
  messageId: string;
};

export async function POST(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId, messageId }: Body = await request.json();
  if (!threadId || !messageId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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

  await supabase
    .from("thread_participants")
    .update({ last_read_msg_id: messageId })
    .eq("thread_id", threadId)
    .eq("user_id", user.id);

  return NextResponse.json({ status: "ok" });
}
