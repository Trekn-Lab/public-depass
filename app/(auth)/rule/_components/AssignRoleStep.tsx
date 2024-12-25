"use client";
import Spin from "@/components/common/Spin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/const/api.const";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { IRole } from "@/interface/role.interface";
import { fetcher } from "@/util/api";
import { useRouter } from "next/navigation";
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { createOrUpdateRule, CreateRoleAction } from "../actions";
import { RulePageState } from "../page";
import { ComboBoxSelectCollection } from "./ComboBoxSelectCollection";

export default function AssignRoleStep({
  state,
  setState,
}: {
  state: RulePageState;
  setState: Dispatch<SetStateAction<RulePageState>>;
}) {
  const { project } = useAuth();
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [addRuleModalOpen, setAddRuleModalOpen] = useState(false);

  const handleAddRuleModalOpen = () => {
    setAddRuleModalOpen(true);
  };

  const key = useMemo(
    () =>
      project?.guild_id ? `${API_URL.Guild.roles}/${project.guild_id}` : null,
    [project]
  );

  const checkPositionRoleKey = useMemo(() => {
    return state.assigneeRoleId
      ? `${API_URL.Bot.checkPosition}/${project?.guild_id}/${state.assigneeRoleId}`
      : null;
  }, [state.assigneeRoleId]);

  const {
    data: roles,
    isLoading,
    isValidating,
  } = useSWR(key, fetcher<IRole[]>);

  const { data: checkPositionRole, isValidating: loadingCheckRole } = useSWR(
    checkPositionRoleKey,
    fetcher<boolean>
  );

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    if (!roles) return;
    if (!project || !project.id) return;

    const role = roles.metadata.find(
      (role) => role.id === state.assigneeRoleId
    );

    const res = await createOrUpdateRule(state, role!, project.id);

    if (res.success) {
      toast({
        title: "Success",
        description:
          state.type === "create"
            ? "Rule has been created"
            : "Rule has been updated",
      });
      router.push("/");
    } else {
      toast({
        title: "Failed",
        description: "Failed to create rule: " + res.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleCreateRole = async () => {
    setLoading(true);
    if (!project?.guild_id) return;
    if (!roleName) return;

    const res = await CreateRoleAction(project.guild_id, roleName);

    if (res.success) {
      toast({
        title: "Success",
        description: "Role has been created",
      });
      mutate(key);
      setAddRuleModalOpen(false);
    } else {
      toast({
        title: "Failed",
        description: "Failed to create role: " + res.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <main className="w-2/3">
      <h1 className="text-4xl font-bold">Assign role</h1>
      <div className="mt-8 space-y-4">
        {isLoading && <Skeleton className="h-12 w-96 rounded-sm" />}

        {/* Not found role */}
        {!isLoading && (!roles || roles.metadata.length === 0) && (
          <Fragment>
            <p className="text-trekn-secondary">
              No roles found! You can go back to your clan settings in Discord
              and create a new role.
              <br />
              Or you can quickly create a new role here.
            </p>
            <div className="grid w-1/2 items-center gap-3">
              <Label>Role name</Label>
              <Input
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Ex: Holder Madlad, SMB, ..."
              />
            </div>
            <Button onClick={handleCreateRole} disabled={!roleName}>
              Create
            </Button>
          </Fragment>
        )}

        {!isLoading && roles && roles.metadata.length !== 0 && (
          <Fragment>
            <h3 className="text-trekn-secondary">
              Anyone access will get the role:
            </h3>
            <ComboBoxSelectCollection
              onChange={(value) => {
                setState((prev) => ({ ...prev, assigneeRoleId: value }));
              }}
              onAddRole={handleAddRuleModalOpen}
              defaultValue={state.assigneeRoleId}
              options={roles.metadata.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
            />
            <div className="flex items-center">
              <p className="text-trekn-secondary">
                {"Click "}
                <span
                  onClick={() => mutate(key)}
                  className="text-white underline cursor-pointer"
                >
                  refresh
                </span>
                {" to get the latest role list"}
              </p>
              <Spin
                className={`ml-1 w-3 h-3 ${isValidating ? "inline" : "hidden"}`}
              />
            </div>
            {!loadingCheckRole && checkPositionRole?.metadata === false && (
              <p className="text-red-500">
                The bot does not have permission to manage this role. Please
                check the bot&apos;s permission.
              </p>
            )}
            <Button
              disabled={
                !state.assigneeRoleId ||
                loading ||
                loadingCheckRole ||
                !checkPositionRole?.metadata
              }
              size="lg"
              className="mt-8"
              onClick={handleCreateOrUpdate}
            >
              {loading && <Spin className="mr-2" />}
              Finish
            </Button>
          </Fragment>
        )}
      </div>
      <AddRoleModal
        setName={setRoleName}
        onCreate={handleCreateRole}
        open={addRuleModalOpen}
        setOpen={setAddRuleModalOpen}
        loading={loading}
      />
    </main>
  );
}

const AddRoleModal = ({
  open,
  setOpen,
  onCreate,
  setName,
  loading,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setName: Dispatch<SetStateAction<string>>;
  onCreate: () => void;
  loading: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Role</DialogTitle>
          <DialogDescription>
            A new role will be created in your discord server.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-3 mt-2">
          <Label>Role name</Label>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Holder Madlad, SMB, ..."
          />
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={onCreate}>
            {loading && <Spin className="mr-2" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
