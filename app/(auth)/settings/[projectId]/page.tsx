"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DISCORD_URL } from "@/const";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";
import { MemberTable } from "@/components/MemberTable/MemberTable";
import CloseCircleBtn from "@/components/CloseCircleBtn/CloseCircleBtn";
import {
  addMember,
  removeMember,
  updateProject,
  uploadAvatar,
} from "../updateProject";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/type/project.type";
import api from "@/util/api";
import AddMemberDialog from "./_components/AddMemberDialog";
import RemoveMemberDialog from "./_components/DeleteMemberDialog";
import clsx from "clsx";
import Spin from "@/components/common/Spin";
import { User } from "@/type/user.type";
import { API_URL } from "@/const/api.const";

export default function SettingPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<Project>();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [isRemoveRemoveMember, setIsOpenRemoveMember] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [userRemove, setUserRemove] = useState<User | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { metadata: project }: { metadata: Project } = await api.get(
        `${API_URL.Project.project}/${projectId}`
      );
      setProject(project);
      console.log(project);
      setUrl(project.avatar || "");
      setName(project.name || "");
      setDescription(project.description || "");
    } catch (error) {
      console.error("Failed to fetch project data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploadImageLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await uploadAvatar({ data: formData });

      if (!uploadResponse?.success) {
        return toast({
          title: "Failed",
          description: "Image upload failed, please try again later!",
          variant: "destructive",
        });
      }

      if (uploadResponse && uploadResponse.success && project?.id) {
        const updateResponse = await updateProject({
          url: uploadResponse.metadata.url,
          projectId: project.id,
        });

        if (updateResponse?.success) {
          setProject(updateResponse.metadata);
          toast({
            title: "Success",
            description: "Avatar updated successfully",
          });
        } else {
          toast({
            title: "Failed",
            description: "Project update failed, please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
    setUploadImageLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const updateResponse = await updateProject({
        name,
        description,
        projectId,
      });

      if (!updateResponse?.success) throw new Error("Failed to update project");

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setProject(updateResponse.metadata);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update project";
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-scroll">
      <div className="container max-w-[50vw] min-h-screen pb-5 mx-auto mt-10">
        <div className="flex items-center justify-between mb-[64px]">
          <p className="text-[32px] font-bold">Settings</p>
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "bg-transparent flex items-center justify-center border border-trekn-default-neutral rounded-full hover:opacity-50 transition-all duration-100 cursor-pointer p-5",
                {
                  "opacity-30 cursor-not-allowed hover:opacity-100!":
                    !isChanged,
                }
              )}
              onClick={isChanged ? handleSave : undefined}
            >
              <Save size={24} color="#e5e7eb" />
            </div>
            <CloseCircleBtn size="lg" />
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-12 w-96 rounded-sm" />
        ) : (
          <div className="grid grid-cols-2 mb-10">
            <div className="flex items-center gap-4">
              {uploadImageLoading ? (
                <div className="w-[100px] h-[100px] rounded-full bg-trekn-default-neutral flex items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <Avatar>
                  <AvatarImage
                    className="w-[100px] h-[100px] object-contain rounded-full"
                    src={imagePreview || url || project?.avatar || DISCORD_URL}
                  />
                  <AvatarFallback>Community logo</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-trekn-default-neutral-secondary w-[60%]">
                  We recommend an image of at least 512x512 for community
                </p>
                <Button
                  variant="outline"
                  className="relative overflow-hidden max-w-[120px]"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  Upload Image
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <Label className="text-sm font-medium text-trekn-default-neutral-secondary">
                  Community name
                </Label>
                <Input
                  placeholder="Community Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setIsChanged(true);
                  }}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-trekn-default-neutral-secondary">
                  Community bio
                </Label>
                <Input
                  placeholder="Community Bio"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsChanged(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-10">
          <p className="mb-6 text-2xl font-medium text-trekn-onbrand">
            Manage connections
          </p>
          <div className="grid grid-cols-3 py-3 items-center">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  className="w-12 h-12 object-contain"
                  src={project?.avatar || DISCORD_URL}
                />
                <AvatarFallback>Community logo</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-trekn-default-neutral-secondary mb-0.5">
                  Discord server
                </p>
                <p className="text-trekn-onbrand text-base font-medium">
                  {project?.guild_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mx-auto">
              <div className="flex items-center p-1 bg-white rounded-full">
                <Check size={16} color="black" />
              </div>
              <p className="text-trekn-onbrand text-sm font-medium">
                Connected
              </p>
            </div>
            {/* <Button variant="outline" className="w-fit ml-auto">
                Replace with a new Discord server
              </Button> */}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-2xl font-medium text-trekn-onbrand">
              Manage access
            </p>
            <Button variant="outline" onClick={() => setIsOpenAddMember(true)}>
              Add a new member
            </Button>
          </div>
          <MemberTable
            data={project?.members || []}
            handleRemove={(u) => {
              setUserRemove(u);
              setIsOpenRemoveMember(true);
            }}
          />
        </div>
      </div>
      <AddMemberDialog
        open={isOpenAddMember}
        onCancel={() => setIsOpenAddMember(false)}
        onConfirm={async (user) => {
          if (project?.id && user?.id) {
            const response = await addMember({
              data: { project_id: project.id, user_id: user.id },
            });
            toast({
              title: response?.success ? "Success" : "Failed",
              description: response?.success
                ? "Member add successfully."
                : "Failed to add member.",
              variant: response?.success ? "default" : "destructive",
            });
            await fetchData();
          }
          setIsOpenAddMember(false);
        }}
      />

      <RemoveMemberDialog
        open={isRemoveRemoveMember}
        onCancel={() => setIsOpenRemoveMember(false)}
        username={userRemove?.name || ""}
        onConfirm={async () => {
          if (userRemove?.id) {
            const response = await removeMember(userRemove.id);
            toast({
              title: response?.success ? "Success" : "Failed",
              description: response?.success
                ? "Member removed successfully."
                : "Failed to remove member.",
              variant: response?.success ? "default" : "destructive",
            });
            await fetchData();
            setIsOpenRemoveMember(false);
          }
        }}
      />
    </div>
  );
}
