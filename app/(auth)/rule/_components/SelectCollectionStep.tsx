/* eslint-disable @next/next/no-img-element */
"use client";
import HorizontalScroll from "@/components/common/HorizontalScroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/const/api.const";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { ICollection } from "@/interface/collection.interface";
import { RuleCondition } from "@/interface/rule.interface";
import api, { fetcher, requestWithContentType } from "@/util/api";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR, { mutate } from "swr";
import { RulePageState } from "../page";
import CollectionChip from "./CollectionChip";
import SearchInput from "./SearchInput";
import UploadCustomData, { UploadCustomDataType } from "./UploadCustomData";

export default function SelectCollectionStep({
  state,
  nextStep,
  setState,
}: {
  state: RulePageState;
  nextStep: () => void;
  setState: Dispatch<SetStateAction<RulePageState>>;
}) {
  const { toast } = useToast();
  const { project, user } = useAuth();
  const [openUploadCustomData, setOpenUploadCustomData] = useState(false);
  const [loadingAddCustomData, setLoadingAddCustomData] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<
    ICollection[] | null
  >(null);

  const key = useMemo(
    () =>
      project?.id
        ? `${API_URL.Collection.collectionProject}/${project.id}?default=true`
        : null,
    [project]
  );
  const { data: collections, isLoading } = useSWR(key, fetcher<ICollection[]>);

  useEffect(() => {
    if (state.ruleInstruction.length > 0) {
      setSelectedCollection(state.ruleInstruction.map((i) => i.collection));
    }
  }, [state]);

  const setCollectionAndNext = () => {
    if (!selectedCollection) return;

    setState((prev) => ({
      ...prev,
      conditions:
        selectedCollection.length > 1 ? RuleCondition.OR : RuleCondition.ONLY,
      ruleInstruction: selectedCollection.map((collection, idx) => ({
        type: collection.type,
        quantity: prev.ruleInstruction[idx]?.quantity || 0,
        collection,
        id: prev.ruleInstruction[idx]?.id,
        rule_id: prev.ruleInstruction[idx]?.rule_id,
      })),
    }));
    nextStep();
  };

  const handleSubmitAddCustomData = async (
    data: {
      name: string;
      symbol?: string;
      img?: string;
      address?: string;
      file?: File;
    },
    type: UploadCustomDataType
  ) => {
    setLoadingAddCustomData(true);

    try {
      const fileKey =
        type === UploadCustomDataType.whitelist
          ? await uploadFile(data.file)
          : null;
      const payload = createPayload(data, type, fileKey);

      const { success }: { success: boolean } = await api.post(
        API_URL.Collection.collection,
        payload
      );
      displayToast(success, type);

      if (success) {
        await mutate(key);
        setOpenUploadCustomData(false);
      }
    } catch (error) {
      console.log(error);
      displayErrorToast(type);
    } finally {
      setLoadingAddCustomData(false);
    }
  };

  const uploadFile = async (file?: File): Promise<string | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await requestWithContentType(
      "post",
      API_URL.Utils.upload,
      formData,
      { "Content-Type": "multipart/form-data" }
    );

    const key = response.metadata?.key;

    if (!key) {
      throw new Error("Key not found in response metadata");
    }

    return key;
  };

  const createPayload = (
    data: { name: string; img?: string; address?: string },
    type: UploadCustomDataType,
    fileKey: string | null
  ) => ({
    project_id: project?.id,
    type,
    name: data.name,
    icon: data.img || "",
    contract_address: data.address ? [data.address] : [],
    is_common: false,
    default: true,
    user_created: user?.id,
    white_list_file: fileKey,
  });

  const displayToast = (success: boolean, type: UploadCustomDataType) => {
    toast({
      title: success ? "Success" : "Failed",
      description: success
        ? `${type} Collection added successfully.`
        : `Failed to add ${type} Collection.`,
      variant: success ? "default" : "destructive",
    });
  };

  const displayErrorToast = (type: UploadCustomDataType) => {
    toast({
      title: "Error",
      description: `An error occurred while adding the ${type.toLowerCase()} collection.`,
      variant: "destructive",
    });
  };

  const handleSelectCollection = (collection: ICollection) => {
    setSelectedCollection((prev) => {
      if (!prev) return [collection];
      if (prev.some((c) => c.id === collection.id)) {
        return prev.filter((c) => c.id !== collection.id);
      }
      return [...prev, collection];
    });
  };

  const isSelect = (collection: ICollection) =>
    selectedCollection?.some((c) => c.id === collection.id);

  return (
    <main className="w-full pb-8">
      <div className="mt-8 flex justify-between w-2/3">
        <h1 className="text-4xl font-bold">Allow access to</h1>
        <div className="flex items-center space-x-2">
          <SearchInput refetchKey={key} />
        </div>
      </div>
      <div className="flex items-center justify-end w-2/3 mt-8"></div>

      <div className="mt-8">
        <HorizontalScroll>
          {selectedCollection &&
            selectedCollection.length > 0 &&
            selectedCollection.map((collection) => (
              <CollectionChip
                key={collection.id}
                name={collection.name}
                icon={collection.icon}
              >
                {collection.name} holders
              </CollectionChip>
            ))}
        </HorizontalScroll>
        <p className="text-trekn-secondary font-medium mt-6">
          Total people can access <span className="text-white">0</span>
        </p>
        <HorizontalScroll className="mt-8">
          {isLoading &&
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-[280px] h-56 rounded-xl" />
            ))}
          {collections?.metadata && collections.metadata.length > 0 && (
            <Fragment>
              <div className="px-3 border border-dashed border-trekn-default-neutral rounded-xl flex flex-col items-center justify-center space-y-3">
                <p className="text-trekn-secondary">
                  Upload an allowlist {"(.csv)"}
                </p>
                <UploadCustomData
                  setOpen={setOpenUploadCustomData}
                  open={openUploadCustomData}
                  loading={loadingAddCustomData}
                  onSubmit={handleSubmitAddCustomData}
                />
              </div>
              {collections.metadata.map((collection) => (
                <div
                  key={collection.id}
                  className="p-3 border border-trekn-default-neutral rounded-xl"
                >
                  <div className="space-y-1">
                    {collection?.icon && (
                      <img
                        alt={collection.name}
                        src={collection.icon}
                        width={42}
                        height={42}
                        className="rounded-full"
                      />
                    )}
                    <h3 className="text-trekn-secondary text-sm">Holders of</h3>
                    <h1 className="font-bold">{collection.name}</h1>
                  </div>
                  <div className="w-48 mt-4 px-3 pt-1 py-2 flex items-center justify-between bg-badge rounded-sm">
                    <p className="text-trekn-secondary">Holders</p>
                    <p className="text-white">0</p>
                  </div>
                  <Button
                    onClick={() => handleSelectCollection(collection)}
                    variant="outline"
                    size="lg"
                    className="mt-6 w-full bg-transparent border-button-border space-x-2"
                  >
                    {isSelect(collection) && (
                      <CheckCircledIcon className="text-[#14AE5C]" />
                    )}
                    Selected
                  </Button>
                </div>
              ))}
            </Fragment>
          )}
        </HorizontalScroll>
        <div className="mt-8">
          <Button
            onClick={setCollectionAndNext}
            disabled={!selectedCollection || selectedCollection.length <= 0}
          >
            Continue
          </Button>
        </div>
      </div>
    </main>
  );
}
