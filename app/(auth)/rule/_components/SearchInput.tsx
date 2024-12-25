/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import Spin from "@/components/common/Spin";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { ICollection } from "@/interface/collection.interface";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import debounce from "lodash.debounce";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { handleSearchCollection, includeCollection } from "../actions";

export default function SearchInput({
  refetchKey,
}: {
  refetchKey: string | null;
}) {
  const { user, project } = useAuth();
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ICollection[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (search: string) => {
    setLoading(true);
    if (!search) {
      setLoading(false);
      setItems([]);
      return;
    }

    if (!project) {
      setLoading(false);
      setItems([]);
      return;
    }

    const data = await handleSearchCollection(project.id, search);

    if (data.success) {
      setItems(data.metadata as ICollection[]);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: data.message,
      });
    }
    setLoading(false);
  };

  const debounceFn = useCallback(
    debounce((search: string) => handleSearch(search), 300),
    []
  );

  const handleIncludeCollection = async (collection: ICollection) => {
    if (!project) return;

    const { id, created_at, updated_at, user_created, ...data } = collection;

    const newCollection = {
      ...data,
      is_common: false,
      default: true,
      user_created: user?.id ?? "ADMIN",
      project_id: project.id,
    };

    console.log(newCollection);

    const res = await includeCollection(newCollection);

    if (res.success) {
      toast({
        title: "Success",
        description: "Collection added successfully",
        variant: "default",
      });
      mutate(refetchKey);
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setItems([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Fragment>
      <div className="w-full relative" ref={containerRef}>
        <Input
          placeholder="Find collection or token"
          className="border-button-border w-[266px]"
          onChange={(e) => debounceFn(e.target.value)}
          endIcon={loading ? <Spin className="h-3 w-3" /> : undefined}
        />

        {items && items.length > 0 && (
          <div className="w-full max-h-72 bg-trekn-main overflow-auto mt-2 absolute rounded-md p-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-2 flex items-center space-x-3 cursor-pointer"
                onClick={() => handleIncludeCollection(item)}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoCircledIcon className="w-5 h-5" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Only verified collection will show up</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Fragment>
  );
}
