import { customAlphabet } from "nanoid";
import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

const nano = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

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

  const code = `EKPAD-${nano()}`;

  const { error } = await supabase
    .from("game_profiles")
    .update({ verify_code: code, verified: false })
    .eq("id", gameProfileId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ verify_code: code });
}
