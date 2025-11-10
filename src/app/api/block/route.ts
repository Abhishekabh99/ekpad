import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

type BlockBody = {
  targetId: string;
};

export async function POST(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetId }: BlockBody = await request.json();
  if (!targetId || targetId === user.id) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  const { error } = await supabase.from("blocks").upsert({ user_id: user.id, blocked_user_id: targetId });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // unfollow relations both ways to enforce safety
  await supabase.from("follows").delete().or(`and(follower_id.eq.${user.id},followee_id.eq.${targetId}),and(follower_id.eq.${targetId},followee_id.eq.${user.id})`);

  return NextResponse.json({ status: "blocked" });
}

export async function DELETE(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetId }: BlockBody = await request.json();
  if (!targetId) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  await supabase.from("blocks").delete().match({ user_id: user.id, blocked_user_id: targetId });
  return NextResponse.json({ status: "unblocked" });
}
