import Confetti from "@/components/Confetti/Confetti";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-t from-trekn-main via-[#1E1E1E] to-[#272E1B]">
      <div className="flex flex-col items-center gap-5">
        <div className="bg-white p-6 w-fit mx-auto rounded-full">
          <Check size={24} color="black" />
        </div>
        <p className="text-sm leading-6">Successfully added your community</p>
        <p className="text-base leading-6 font-medium">
          Keep coming back to try out something new!
        </p>
        <Link href={"/"} className="w-full mt-3.5">
          <Button size={"xl"} className="w-full">
            <p className="text-base leading-6 font-medium text-trekn-default-default">
              Understood, bring me to homepage
            </p>
          </Button>
        </Link>
      </div>
      <Confetti />
    </div>
  );
}
