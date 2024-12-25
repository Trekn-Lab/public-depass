import { DiscordIcon, TreknIcon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Login: React.FC = () => {
  const discordLoginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/login`;

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <TreknIcon />
      <div className="text-center">
        <h1 className="font-medium text-4xl leading-[50.4px] mb-3">
          Welcome to Trekn
        </h1>
        <p className="text-trekn-default-tertiary text-base leading-[22.4px]">
          Access the fastest gating solution for your community
        </p>
      </div>
      <Link href={discordLoginUrl} className="w-[60%]">
        <Button size="xl" className="w-full flex items-center gap-2">
          <DiscordIcon />
          <span className="text-base leading-6 font-medium">
            Login with Discord
          </span>
        </Button>
      </Link>
    </div>
  );
};

export default Login;
