import { HelpCircleIcon } from "@/const";
import Link from "next/link";
import React from "react";

export default function ContactSupport() {
  return (
    <Link
      href="mailto:hello@trekn.xyz"
      className="fixed bottom-12 right-20 z-50"
    >
      <div className="flex items-center gap-2 text-white py-2 px-4 rounded-xl border border-[#525252]">
        {HelpCircleIcon}
        <span>Contact support</span>
      </div>
    </Link>
  );
}
