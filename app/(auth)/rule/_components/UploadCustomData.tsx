import Spin from "@/components/common/Spin";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import AddTokenCollection from "./AddTokenCollection";
import UploadWhitelist from "./UploadWhitelist";

export enum UploadCustomDataType {
  token = "TOKEN",
  whitelist = "WHITELIST"
}

interface UploadCustomDataProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  loading: boolean;
  onSubmit: (
    data: { name: string; symbol?: string; img?: string; address?: string },
    type: UploadCustomDataType
  ) => void;
}

const UploadOptionButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <Button
    variant="outline"
    size="lg"
    className="border-button-border bg-transparent w-48"
    onClick={onClick}
  >
    {label}
  </Button>
);

export default function UploadCustomData({
  open,
  setOpen,
  loading,
  onSubmit,
}: UploadCustomDataProps) {
  const [type, setType] = useState<UploadCustomDataType | null>(null);

  const handleClose = (state: boolean) => {
    setOpen(state);
    setType(null);
  };

  const titles = {
    [UploadCustomDataType.token]: "Add Token Collection",
    [UploadCustomDataType.whitelist]: "Add Whitelist/Hashlist",
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="border-button-border bg-transparent w-48"
        >
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type ? titles[type] : "Upload Custom Documents"}
          </DialogTitle>
        </DialogHeader>
        {!type && (
          <div className="flex flex-col items-center gap-3 py-4">
            {Object.entries(UploadCustomDataType).map(([key, value]) => (
              <UploadOptionButton
                key={value}
                label={titles[value as UploadCustomDataType] || key}
                onClick={() => setType(value as UploadCustomDataType)}
              />
            ))}
          </div>
        )}
        {type === UploadCustomDataType.token && (
          <AddTokenCollection
            loading={loading}
            onSubmit={(data) => onSubmit(data, type)}
          />
        )}
        {type === UploadCustomDataType.whitelist && (
          <UploadWhitelist
            loading={loading}
            onSubmit={(data) => onSubmit(data, type)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
