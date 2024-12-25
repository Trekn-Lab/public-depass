"use client";
import { DISCORD_URL, LogOutIcon } from "@/const";
import { useAuth } from "@/context/auth";
import api from "@/util/api";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const style = {
  display: "flex",
  gap: 32,
};

const Account = () => {
  const navigate = useRouter();
  const { user } = useAuth();

  const discordUser = useMemo(() => {
    return user?.socialAccounts.find(
      (account) => account.provider === "discord"
    );
  }, [user]);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    deleteCookie("token");
    navigate.push("/login");
  };

  return (
    <div className="h-full flex justify-between gap-2">
      <div
        className="h-full items-center px-4 py-2 border border-trekn-default-neutral rounded-full"
        style={style}
      >
        <div className="flex items-center">
          <Avatar className="w-9 h-9 flex items-center justify-center">
            <AvatarImage src={discordUser?.avatar || DISCORD_URL} />
            <AvatarFallback>Trekn logo</AvatarFallback>
          </Avatar>
          <span className="font-medium text-white pl-2 pr-4">{user?.name}</span>
        </div>
        <span className="text-[#757575] font-normal text-sm pl-4">
          Community admin
        </span>
      </div>
      <div
        className="px-4 rounded-full font-medium border border-trekn-default-neutral flex justify-center items-center hover:opacity-80 cursor-pointer"
        onClick={handleLogout}
      >
        {LogOutIcon}
      </div>
    </div>
  );
};

export default Account;
