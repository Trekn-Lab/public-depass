"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "@/const/api.const";
import { useOnboard } from "@/context/onboard";
import { IGuild } from "@/interface/guild.interface";
import { fetcher } from "@/util/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

export default function OnboardInitPage() {
  const { setForm, guildId } = useOnboard();
  const navigate = useRouter();
  const { data: listGuild } = useSWR(
    API_URL.User.guildsManager,
    fetcher<IGuild[]>
  );

  const duplicateGuildKey = useMemo(
    () => (guildId ? `${API_URL.Project.checkDuplicate}/${guildId}` : null),
    [guildId]
  );

  const { error, isLoading } = useSWR(duplicateGuildKey, fetcher);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 border border-dashed border-trekn-secondary w-fit rounded-full">
          <Plus size={24} color="#A9A9A9" />
        </div>
        <p className="font-bold text-[36px] leading-[50.4px]">
          Add a community
        </p>
      </div>
      <Select
        onValueChange={(value) => {
          setForm({ guildId: value });
        }}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select your community" />
        </SelectTrigger>
        <SelectContent>
          {listGuild?.metadata?.map((item, idx) => (
            <SelectItem key={idx} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm">
          Error: This community is already connected to Trekn! To create a new
          connection, you need to kick the Trekn bot that is in this discord
          guild.
        </p>
      )}
      <Button
        size={"xl"}
        className="w-full"
        disabled={!guildId || error || isLoading}
        onClick={() => {
          navigate.push("/onboarding/connect");
        }}
      >
        <p className="text-base leading-6 font-medium">Continue</p>
      </Button>
    </div>
  );
}
