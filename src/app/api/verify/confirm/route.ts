import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

type Body = {
  gameProfileId: string;
};

export async function POST(request: Request) {
  const supabase = getRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameProfileId }: Body = await request.json();
  if (!gameProfileId) {
    return NextResponse.json({ error: "Missing gameProfileId" }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("game_profiles")
    .select("id, verify_code")
    .eq("id", gameProfileId)
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 });
  }

  if (!profile.verify_code) {
    return NextResponse.json({ error: "Request verification code first" }, { status: 400 });
  }

  await supabase.from("game_profiles").update({ verified: true }).eq("id", profile.id);

  return NextResponse.json({ status: "verified" });
}
