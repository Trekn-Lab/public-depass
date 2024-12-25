"use client";

import Account from "@/components/Account/Account";
import Stepper from "@/components/Stepper/Stepper";
import { OnboardProvider } from "@/context/onboard";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import ProjectDispatch from "./_components/ProjectDispatch";

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const stepIndex = useMemo(() => {
    const lastSegment = pathname.split("/").pop();
    const result =
      lastSegment === "init" ? 0 : lastSegment === "select" ? 1 : 2;
    return result;
  }, [pathname]);

  return (
    <OnboardProvider>
      <ProjectDispatch />
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-center mt-[60px]">
          <Account />
        </div>
        <div className="container mx-auto relative flex-1">
          <div className="absolute top-1/2 -translate-y-1/2">
            <Stepper
              steps={[
                { label: "Initiate", description: "Provide community name" },
                { label: "Select Guild", description: "Select Guild" },
                { label: "Connect", description: "Invite Trekn bot" },
              ]}
              stepIndex={stepIndex}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%]">
            {children}
          </div>
        </div>
      </div>
    </OnboardProvider>
  );
}
