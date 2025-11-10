import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

type FollowBody = {
  targetId: string;
};

async function fetchCounts(supabase: ReturnType<typeof getRouteHandlerClient>, targetId: string) {
  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("followee_id", targetId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", targetId)
  ]);

  return {
    followers: followers ?? 0,
    following: following ?? 0
  };
}

export async function POST(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetId }: FollowBody = await request.json();
  if (!targetId || targetId === user.id) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  const { count: blockedCount } = await supabase
    .from("blocks")
    .select("*", { count: "exact", head: true })
    .or(`and(user_id.eq.${user.id},blocked_user_id.eq.${targetId}),and(user_id.eq.${targetId},blocked_user_id.eq.${user.id})`);

  if ((blockedCount ?? 0) > 0) {
    return NextResponse.json({ error: "Blocked", code: "blocked" }, { status: 403 });
  }

  const { error } = await supabase
    .from("follows")
    .upsert({ follower_id: user.id, followee_id: targetId }, { onConflict: "follower_id,followee_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const counts = await fetchCounts(supabase, targetId);

  return NextResponse.json({
    status: "followed",
    counts
  });
}

export async function DELETE(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetId }: FollowBody = await request.json();
  if (!targetId) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  await supabase.from("follows").delete().match({ follower_id: user.id, followee_id: targetId });
  const counts = await fetchCounts(supabase, targetId);

  return NextResponse.json({
    status: "unfollowed",
    counts
  });
}
