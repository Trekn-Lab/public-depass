"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { useOnboard } from "@/context/onboard";
import api from "@/util/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, KeyboardEvent, useEffect } from "react";

export default function OnboardInitPage() {
  const { project } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const { setForm } = useOnboard();
  const navigate = useRouter();

  const handleCreateProject = async () => {
    if (!projectName) return;
    setLoading(true);

    try {
      const { metadata: project }: { metadata: { id: string } } =
        await api.post("/project", {
          name: projectName,
          description: projectName,
        });

      if (project?.id) {
        setForm({ projectId: project.id });
        navigate.push("/onboarding/select");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      setForm({ projectId: project.id });
      navigate.push("/onboarding/select");
    }
  }, [project]);

  const onEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && projectName) {
      handleCreateProject();
    }
  };

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
      <Input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Input your community name"
        onKeyDown={onEnterPress}
      />
      <Button
        size="xl"
        className="w-full"
        onClick={handleCreateProject}
        disabled={loading || !projectName}
      >
        <p className="text-base leading-6 font-medium">Continue</p>
      </Button>
    </div>
  );
}
