"use client";
import clsx from "clsx";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface CloseCircleBtnProps {
  size?: "sm" | "lg";
  href?: string;
  onClick?: () => void;
}

const CloseCircleBtn: React.FC<CloseCircleBtnProps> = ({
  size = "sm",
  href,
  onClick
}) => {
  const router = useRouter();

  const back = () => {
    return href ? router.push(href) : router.back();
  };

  const iconSize = {
    sm: 16,
    lg: 24,
  };

  return (
    <div
      onClick={onClick || back}
      className={clsx(
        "flex items-center justify-center border border-trekn-default-neutral rounded-full hover:opacity-50 transition-all duration-100 cursor-pointer",
        {
          "p-5": size === "lg",
          "w-6 h-6": size === "sm",
        }
      )}
    >
      <X size={iconSize[size]} />
    </div>
  );
};

export default CloseCircleBtn;
