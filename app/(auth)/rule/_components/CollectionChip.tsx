/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import React from "react";

export default function CollectionChip({
  name,
  icon,
  children,
  className,
}: {
  name: string;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-fit space-x-2 px-3 py-2 bg-badge rounded-full",
        className
      )}
    >
      {icon && (
        <img
          alt={name}
          src={icon}
          width={24}
          height={24}
          className="rounded-full"
        />
      )}
      <h1 className="text-white">{children ? children : name}</h1>
    </div>
  );
}
