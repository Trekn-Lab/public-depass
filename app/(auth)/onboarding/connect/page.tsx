"use client";

import { DiscordIconLg, Line2Arrow, TreknIcon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { useOnboard } from "@/context/onboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConnectDiscord() {
  const { guildId, projectId } = useOnboard();

  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      navigate.push("/onboarding/init");
    } else if (!guildId) {
      navigate.push("/onboarding/select");
    }
  }, [projectId, guildId, navigate]);

  const handleConnect = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/bot-command/install-bot?guild_id=${guildId}&project_id=${projectId}`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-3">
        <TreknIcon size={48} />
        <Line2Arrow />
        <DiscordIconLg />
      </div>
      <p className="text-[36px] leading-[50.4px] font-bold text-center">
        Invite Trekn bot to Discord
      </p>

      <Button
        size="xl"
        className="w-full"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <p className="text-base leading-6 font-medium">Invite</p>
        )}
      </Button>
    </div>
  );
}
