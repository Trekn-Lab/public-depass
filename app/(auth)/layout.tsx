import Account from "@/components/Account/Account";
import ContactSupport from "@/components/ContactSupport/contactSupport";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="bg-[#1E1E1E] overflow-hidden">
    //   <div className="w-full p-5 flex justify-between items-center">
    //     <Link href={"/"}>
    //       <Avatar className="w-9 h-9 object-contain">
    //         <AvatarImage src="/images/trekn_logo.png" />
    //         <AvatarFallback>Trekn logo</AvatarFallback>
    //       </Avatar>
    //     </Link>
    //     <Account />
    //   </div>
    //   <div className="flex flex-col justify-between">{children}</div>
    //   <ContactSupport />
    // </div>
    children
  );
}
