import { getFollowCounts } from "@/lib/social";

type FollowCountsProps = {
  userId: string;
};

export async function FollowCounts({ userId }: FollowCountsProps) {
  const counts = await getFollowCounts(userId);

  return (
    <div className="flex gap-6 text-sm text-muted-foreground">
      <span>
        <strong className="text-foreground">{counts.followers}</strong> Followers
      </span>
      <span>
        <strong className="text-foreground">{counts.following}</strong> Following
      </span>
    </div>
  );
}
