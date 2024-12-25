"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spin from "@/components/common/Spin";
import Link from "next/link";

interface UploadWhitelistProps {
  onSubmit: (tokenInfo: {
    name: string;
    symbol?: string;
    img?: string;
    address?: string;
    file: File;
  }) => void;
  loading: boolean;
}

export default function UploadWhitelist({
  onSubmit,
  loading,
}: UploadWhitelistProps) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (file) {
      onSubmit({ name, file });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Name"
          value={name}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <Label htmlFor="file">Whitelist file (csv)</Label>
        <Button variant="outline" className="relative overflow-hidden max-w-[120px]">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {file?.name || "Upload File"}
        </Button>
      </div>

      <Link className="text-blue-400 hover:opacity-50" href={"https://trekn-miniapp.s3.ap-southeast-1.amazonaws.com/2024-11-11T15:24:41.032Z-sample.csv"}>Sample file</Link>

      <DialogFooter>
        <Button onClick={handleSubmit} disabled={loading || !file}>
          {loading ? <Spin /> : "Add"}
        </Button>
      </DialogFooter>
    </>
  );
}
