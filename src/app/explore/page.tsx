import Link from "next/link";

import { FollowButton } from "@/components/social/FollowButton";
import { Button } from "@/components/ui/button";
import { getSuggestedProfiles } from "@/lib/social";
import { getServerClient } from "@/lib/supabase/server";

export default async function ExplorePage() {
  const supabase = getServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const suggestions = await getSuggestedProfiles(user?.id ?? null, 8);

  return (
    <div className="container space-y-12 py-12">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-neon">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-cyan/80">Explore</p>
            <h1 className="text-3xl font-semibold">Discover new squads</h1>
            <p className="text-sm text-muted-foreground">
              Fresh handles, neon energy. Follow creators and jump into chats instantly.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/search">Search players</Link>
          </Button>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((profile) => (
            <article key={profile.id} className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/u/${profile.handle}`} className="text-lg font-semibold hover:text-brand-cyan">
                    {profile.display_name ?? profile.handle}
                  </Link>
                  <p className="text-sm text-muted-foreground">@{profile.handle}</p>
                </div>
                {user?.id && (
                  <FollowButton targetId={profile.id} disabled={profile.id === user.id} />
                )}
              </div>
              {profile.bio && <p className="mt-4 text-sm text-muted-foreground/90">{profile.bio}</p>}
            </article>
          ))}
          {suggestions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
              No suggestions yet — invite friends to join Ekpad.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-black/30 p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Who to follow</h2>
          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Recent arrivals</span>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {suggestions.slice(0, 3).map((profile) => (
            <div key={profile.id} className="rounded-2xl bg-brand-purple/10 p-4">
              <p className="text-sm uppercase tracking-[0.25em] text-brand-cyan/80">New</p>
              <Link href={`/u/${profile.handle}`} className="text-lg font-semibold">
                {profile.display_name ?? profile.handle}
              </Link>
              <p className="text-xs text-muted-foreground">@{profile.handle}</p>
            </div>
          ))}
          {suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground">We’ll surface suggestions once more pioneers join.</p>
          )}
        </div>
      </section>
    </div>
  );
}
