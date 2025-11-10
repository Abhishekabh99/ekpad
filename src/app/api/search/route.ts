import { NextResponse } from "next/server";

import { getRouteHandlerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const supabase = getRouteHandlerClient();
  const { data, error } = await supabase.rpc("search_profiles", { q });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    results: (data ?? []).map((row) => ({
      handle: row.handle,
      display_name: row.display_name,
      bio: row.bio,
      rank: row.rank
    }))
  });
}
