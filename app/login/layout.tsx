import Image from "next/image";
import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-12">
      <div className="relative w-full h-screen">
        <Image
          alt="login-image"
          src="/images/login/login.png"
          fill
          className="object-center object-cover"
        />
      </div>
      {children}
    </div>
  );
}
