import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

type ReportBody = {
  targetUserId?: string;
  messageId?: string;
  reason: string;
};

export async function POST(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId, messageId, reason }: ReportBody = await request.json();

  if (!reason?.trim() || (!targetUserId && !messageId)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    target_user_id: targetUserId ?? null,
    message_id: messageId ?? null,
    reason
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: "reported" });
}
