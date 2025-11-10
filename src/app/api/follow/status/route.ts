import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetId = url.searchParams.get("targetId");

  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!targetId) {
    return NextResponse.json({ error: "Missing targetId" }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({
      status: { isFollowing: false, isFollowedBy: false, blocked: false }
    });
  }

  const [{ count: isFollowing }, { count: isFollowedBy }, { count: blockedCount }] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", user.id)
      .eq("followee_id", targetId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", targetId)
      .eq("followee_id", user.id),
    supabase
      .from("blocks")
      .select("*", { count: "exact", head: true })
      .or(`and(user_id.eq.${user.id},blocked_user_id.eq.${targetId}),and(user_id.eq.${targetId},blocked_user_id.eq.${user.id})`)
  ]);

  return NextResponse.json({
    status: {
      isFollowing: (isFollowing ?? 0) > 0,
      isFollowedBy: (isFollowedBy ?? 0) > 0,
      blocked: (blockedCount ?? 0) > 0
    }
  });
}
