import Account from "@/components/Account/Account";
import ContactSupport from "@/components/ContactSupport/contactSupport";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DISCORD_URL } from "@/const";
import { API_URL } from "@/const/api.const";
import { IProject } from "@/interface/project.interface";
import { SR_Fetcher } from "@/util/SR_api";
import Image from "next/image";
import Link from "next/link";
import TableRules from "./_components/TableRules";

export default async function HomePage() {
  // default project[0]
  const { metadata: project } = await SR_Fetcher<IProject[]>(
    API_URL.User.projects
  );

  return (
    <main className="w-full flex flex-col items-center overflow-hidden relative">
      <div className="w-full p-5 flex justify-between items-center">
        <Image
          width={100}
          height={40}
          alt="logo"
          src="/images/depass-logo.png"
        />
        <Account />
      </div>

      {project[0] && (
        <div className="mt-10 w-full flex flex-col items-center">
          <div className="w-1/2">
            <div className="w-full flex justify-between items-center">
              <div>
                <Image
                  width={100}
                  height={100}
                  className="rounded-full"
                  objectFit="cover"
                  alt={project[0].name}
                  src={project[0].avatar || DISCORD_URL}
                />
                <div className="mt-6 space-y-2 pl-2">
                  <h1 className="text-2xl font-medium">{project[0]?.name}</h1>
                  <h3 className="text-trekn-secondary">
                    {project[0].description}
                  </h3>
                </div>
              </div>
              <Link href={`/settings/${project[0].id}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-button-border"
                >
                  Open setting
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center space-x-3 pl-2">
                <Avatar>
                  <AvatarImage
                    src={project[0].avatar}
                    alt={project[0].guild_name}
                  />
                  <AvatarFallback>
                    {project[0].guild_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-trekn-secondary">Discord server</h3>
                  <h3 className="font-medium">
                    {project[0].guild_name || "Not connected"}
                  </h3>
                </div>
              </div>
              <Link href="/rule?type=create">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-button-border"
                >
                  Add a new rule
                </Button>
              </Link>
            </div>

            <div className="mt-6">
              {project[0] && (
                <TableRules
                  members={project[0].guild_members_verified}
                  id={project[0].id}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <ContactSupport />
    </main>
  );
}
