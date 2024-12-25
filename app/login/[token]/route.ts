import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SR_Fetcher } from "@/util/SR_api";
import { UserInterface } from "@/interface/user.interface";

export async function GET(req: Request) {
  const token = new URL(req.url).pathname.split("/")[2];

  cookies().set("token", token, {
    maxAge: 60 * 60 * 24 * 14,
  });

  const user = await SR_Fetcher<UserInterface>("/user/me");

  if (!user || !user.success) {
    return NextResponse.redirect(`${process.env.FE_URL}/login`);
  }

  if (!user.metadata.project) {
    return NextResponse.redirect(`${process.env.FE_URL}/onboarding/init`);
  }

  if (!user.metadata.project.guild_id) {
    return NextResponse.redirect(`${process.env.FE_URL}/onboarding/select`);
  }

  return NextResponse.redirect(`${process.env.FE_URL}`);
}
