"use server";

import { revalidatePath } from "next/cache";

import { getServerActionClient } from "@/lib/supabase/server";

export async function addPlatformAction(formData: FormData) {
  const platform = String(formData.get("platform") ?? "").trim();
  const externalUsername = String(formData.get("external_username") ?? "").trim();
  const externalId = String(formData.get("external_id") ?? "").trim();
  const handle = String(formData.get("handle") ?? "").trim();

  if (!platform || !externalUsername) {
    throw new Error("Platform and username are required.");
  }

  const supabase = getServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sign in required.");
  }

  const { error } = await supabase.from("game_profiles").insert({
    user_id: user.id,
    platform,
    external_username: externalUsername,
    external_id: externalId || null
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/u/${handle}`);
}

export async function removePlatformAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const handle = String(formData.get("handle") ?? "").trim();

  if (!id) {
    throw new Error("Missing game profile id");
  }

  const supabase = getServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sign in required.");
  }

  await supabase.from("game_profiles").delete().match({ id, user_id: user.id });
  revalidatePath(`/u/${handle}`);
}
