import { API_URL } from "@/const/api.const";
import { Project } from "@/type/project.type";
import api, { Api_MiniApp } from "@/util/api";

export const uploadAvatar = async ({ data }: { data: FormData }): Promise<{ success: boolean; metadata: { url: string } } | undefined> => {
  try {
    const res: { success: boolean; metadata: { url: string } } = await Api_MiniApp.post("upload", data);
    return res;
  } catch (error) {
    console.error("Upload avatar failed:", error);
    return undefined;
  }
};

export const updateProject = async ({
  projectId,
  url,
  name,
  description,
}: {
  projectId: string;
  url?: string;
  name?: string;
  description?: string;
}): Promise<{ success: boolean; metadata: Project } | undefined> => {
  try {
    const payload: { name?: string; description?: string; avatar?: string } = {};

    if (url) payload.avatar = url;
    if (name) payload.name = name;
    if (description) payload.description = description;

    const res: { success: boolean; metadata: Project } = await api.patch(`${API_URL.Project.project}/${projectId}`, payload);
    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update project");
  }
};


export const addMember = async ({ data }: { data: { project_id: string; user_id: string } }): Promise<{ success: boolean } | undefined> => {
  try {
    const response: { success: boolean } | undefined = await api.patch(API_URL.Project.projectMembers, {
      ...data,
      role: "CONTRIBUTOR",
    });
    return response;
  } catch (error) {
    console.error("Failed to add member:", error);
    throw new Error("Failed to add member");
  }
};

export const removeMember = async (userId: string): Promise<{ success: boolean } | undefined> => {
  try {
    const response: { success: boolean } | undefined = await api.patch(`${API_URL.Project.projectMemberRemove}/${userId}`);
    return response;
  } catch (error) {
    console.error("Failed to remove member:", error);
    throw new Error("Failed to remove member");
  }
};

