import Account from "@/components/Account/Account";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function RuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1E1E1E] overflow-hidden">
      <div className="w-full p-5 flex justify-between items-center">
        <Link href={"/"}>
          <Image
            width={100}
            height={40}
            alt="logo"
            src="/images/depass-logo.png"
          />
        </Link>
        <Account />
      </div>
      <div className="h-[85%] flex flex-col justify-between">{children}</div>
    </div>
  );
}

export default RuleLayout;
