"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import debounce from "lodash.debounce";
import { getTokenMetadata } from "../actions";
import Spin from "@/components/common/Spin";
import Image from "next/image";

export default function AddTokenCollection({
  onSubmit,
  loading: loadingAddToken,
}: {
  onSubmit: (tokenInfo: {
    name: string;
    symbol: string;
    img: string;
    address: string;
  }) => void;
  loading: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    img: string;
    address: string;
  } | null>(null);

  const handleGetTokenData = async (address: string) => {
    setLoading(true);
    const tokenMetadata = await getTokenMetadata(address);
    setLoading(false);
    if (tokenMetadata) {
      setTokenInfo(tokenMetadata);
    }
  };

  const debounceFn = useCallback(
    debounce((address: string) => handleGetTokenData(address), 300),
    []
  );

  return (
    <>
      <div>
        <Label htmlFor="tokenAddress">Token Address</Label>
        <Input
          id="tokenAddress"
          placeholder="Token Address"
          className="mt-1"
          onChange={(e) => debounceFn(e.target.value)}
          endIcon={loading ? <Spin className="h-3 w-3" /> : undefined}
        />
      </div>
      <div className="mt-4">
        {tokenInfo && (
          <div className="mt-4 flex items-center gap-3">
            <Image
              src={tokenInfo.img}
              alt={tokenInfo.name}
              width={50}
              height={50}
              objectFit="cover"
              objectPosition="center"
            />
            <div>
              <p>Name: {tokenInfo.name}</p>
              <p>Symbol: {tokenInfo.symbol}</p>
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          onClick={() => tokenInfo && onSubmit(tokenInfo)}
          disabled={loading || !tokenInfo || loadingAddToken}
        >
          {loadingAddToken ? <Spin /> : "Add"}
        </Button>
      </DialogFooter>
    </>
  );
}
