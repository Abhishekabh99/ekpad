"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  targetId: string;
  initialStatus?: {
    isFollowing: boolean;
    isFollowedBy: boolean;
    blocked: boolean;
  };
  disabled?: boolean;
  className?: string;
};

export function FollowButton({ targetId, initialStatus, disabled, className }: FollowButtonProps) {
  const [status, setStatus] = useState(initialStatus ?? { isFollowing: false, isFollowedBy: false, blocked: false });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialStatus) return;
    const controller = new AbortController();
    fetch(`/api/follow/status?targetId=${targetId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.status) {
          setStatus(payload.status);
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [targetId, initialStatus]);

  const isSelfOrBlocked = status.blocked || disabled;

  const handleClick = (follow: boolean) => {
    startTransition(async () => {
      const res = await fetch("/api/follow", {
        method: follow ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error);
        return;
      }
      setStatus((prev) => ({ ...prev, isFollowing: follow }));
    });
  };

  const label = status.isFollowing ? "Following" : status.isFollowedBy ? "Follow back" : "Follow";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        aria-label={status.isFollowing ? "Unfollow player" : "Follow player"}
        disabled={isPending || isSelfOrBlocked}
        variant={status.isFollowing ? "outline" : "default"}
        onClick={() => handleClick(!status.isFollowing)}
        className="min-w-[120px]"
      >
        {isPending ? "Updating..." : label}
      </Button>
      {status.isFollowedBy && !status.isFollowing && <span className="text-xs text-muted-foreground">Follows you</span>}
      {status.blocked && <span className="text-xs text-muted-foreground">Blocked</span>}
    </div>
  );
}
