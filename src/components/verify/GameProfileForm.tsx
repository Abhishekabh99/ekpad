"use client";

import { useState, useTransition } from "react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  handle: string;
};

export function GameProfileForm({ action, handle }: Props) {
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [externalId, setExternalId] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3 rounded-2xl border border-dashed border-white/10 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("platform", platform);
        formData.append("external_username", username);
        formData.append("external_id", externalId);
        formData.append("handle", handle);
        startTransition(async () => {
          await action(formData);
          setPlatform("");
          setUsername("");
          setExternalId("");
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <input
          className="rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-cyan/60"
          placeholder="Platform (Steam, PSN...)"
          value={platform}
          required
          onChange={(event) => setPlatform(event.target.value)}
        />
        <input
          className="rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-cyan/60"
          placeholder="Username"
          value={username}
          required
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-cyan/60"
          placeholder="External ID (optional)"
          value={externalId}
          onChange={(event) => setExternalId(event.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-cyan px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {isPending ? "Linking…" : "Add platform"}
      </button>
    </form>
  );
}
