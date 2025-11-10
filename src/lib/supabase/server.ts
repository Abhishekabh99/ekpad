import { createClient } from "@supabase/supabase-js";
import {
  createServerComponentClient,
  createServerActionClient,
  createRouteHandlerClient,
  createMiddlewareClient
} from "@supabase/auth-helpers-nextjs";
import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars missing — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const getServerClient = () =>
  createServerComponentClient<Database>({ cookies });

export const getServerActionClient = () =>
  createServerActionClient<Database>({ cookies });

export const getRouteHandlerClient = () =>
  createRouteHandlerClient<Database>({ cookies });

export const getMiddlewareClient = (opts: {
  req: NextRequest;
  res: NextResponse;
}) => createMiddlewareClient<Database>({ req: opts.req, res: opts.res });

export const getServiceRoleClient = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase service role configuration");
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
};

export const getClientEnv = () => ({
  supabaseUrl,
  supabaseAnonKey
});
