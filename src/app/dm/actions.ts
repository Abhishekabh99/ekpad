"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerActionClient } from "@/lib/supabase/server";

export async function startThreadAction(formData: FormData) {
  const handleRaw = formData.get("handle");
  const handle = String(handleRaw ?? "")
    .replace("@", "")
    .trim()
    .toLowerCase();

  if (!handle) {
    throw new Error("Missing handle");
  }

  const supabase = getServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: target, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name")
    .ilike("handle", handle)
    .single();

  if (error || !target) {
    throw new Error("Player not found");
  }

  if (target.id === user.id) {
    throw new Error("You cannot DM yourself.");
  }

  const { count: blocked } = await supabase
    .from("blocks")
    .select("*", { count: "exact", head: true })
    .or(`and(user_id.eq.${user.id},blocked_user_id.eq.${target.id}),and(user_id.eq.${target.id},blocked_user_id.eq.${user.id})`);

  if ((blocked ?? 0) > 0) {
    throw new Error("Blocked users cannot exchange DMs.");
  }

  const { data: viewerThreads = [] } = await supabase
    .from("thread_participants")
    .select("thread_id")
    .eq("user_id", user.id);

  let threadId: string | null = null;

  if (viewerThreads.length) {
    const viewerThreadIds = viewerThreads.map((row) => row.thread_id);
    const { data: mutual } = await supabase
      .from("thread_participants")
      .select("thread_id")
      .eq("user_id", target.id)
      .in("thread_id", viewerThreadIds)
      .limit(1);

    if (mutual && mutual.length > 0) {
      threadId = mutual[0].thread_id;
    }
  }

  if (!threadId) {
    const { data: thread, error: threadError } = await supabase
      .from("threads")
      .insert({ is_group: false })
      .select("id")
      .single();

    if (threadError || !thread) {
      throw new Error(threadError?.message ?? "Unable to create thread");
    }
    threadId = thread.id;

    await supabase.from("thread_participants").insert([
      { thread_id: threadId, user_id: user.id },
      { thread_id: threadId, user_id: target.id }
    ]);
  }

  revalidatePath("/dm");
  redirect(`/dm/${threadId}`);
}
