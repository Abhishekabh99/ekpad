import { cache } from "react";

import { getServerClient } from "@/lib/supabase/server";

export const getProfileByHandle = cache(async (handle: string) => {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("handle", handle)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
});

export const getFollowCounts = cache(async (userId: string) => {
  const supabase = getServerClient();
  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("followee_id", userId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId)
  ]);

  return {
    followers: followers ?? 0,
    following: following ?? 0
  };
});

export const getFollowStatus = async (viewerId: string, targetId: string) => {
  const supabase = getServerClient();
  const [{ count: isFollowing }, { count: isFollowedBy }] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", viewerId)
      .eq("followee_id", targetId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", targetId)
      .eq("followee_id", viewerId)
  ]);

  return {
    isFollowing: (isFollowing ?? 0) > 0,
    isFollowedBy: (isFollowedBy ?? 0) > 0
  };
};

export const getBlockStatus = async (viewerId: string, targetId: string) => {
  const supabase = getServerClient();
  const [{ count: viewerBlocked }, { count: targetBlocked }] = await Promise.all([
    supabase.from("blocks").select("*", { count: "exact", head: true }).eq("user_id", viewerId).eq("blocked_user_id", targetId),
    supabase.from("blocks").select("*", { count: "exact", head: true }).eq("user_id", targetId).eq("blocked_user_id", viewerId)
  ]);

  return {
    viewerHasBlocked: (viewerBlocked ?? 0) > 0,
    viewerIsBlocked: (targetBlocked ?? 0) > 0
  };
};

export const getSuggestedProfiles = async (viewerId: string | null, limit = 6) => {
  const supabase = getServerClient();
  const [recent, following, blocks] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, handle, display_name, bio, avatar_url, created_at")
      .order("created_at", { ascending: false })
      .limit(limit + 12),
    viewerId
      ? supabase.from("follows").select("followee_id").eq("follower_id", viewerId)
      : Promise.resolve({ data: [] }),
    viewerId
      ? supabase.from("blocks").select("blocked_user_id").eq("user_id", viewerId)
      : Promise.resolve({ data: [] })
  ]);

  const followingIds = new Set(
    (following?.data as Array<{ followee_id: string }> | undefined)?.map((row) => row.followee_id)
  );
  const blockedIds = new Set(
    (blocks?.data as Array<{ blocked_user_id: string }> | undefined)?.map((row) => row.blocked_user_id)
  );

  const unique =
    recent.data?.filter((profile) => {
      if (!profile.id || !profile.handle) return false;
      if (viewerId && profile.id === viewerId) return false;
      if (followingIds.has(profile.id)) return false;
      if (blockedIds.has(profile.id)) return false;
      return true;
    }) ?? [];

  return unique.slice(0, limit);
};
