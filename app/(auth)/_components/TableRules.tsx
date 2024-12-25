"use client";
import Table, { Columns, Data } from "@/components/common/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DownArrowIcon } from "@/const";
import { IRule } from "@/interface/rule.interface";
import { fetcher } from "@/util/api";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import useSWR from "swr";
import DropMenu from "./DropMenu";
import { InstructionEnum } from "@/interface/rule_instruction.interface";

const columns = (key: string): Columns[] => [
  {
    key: "role",
    title: "Discord Role",
    dataIndex: "role",
    render: (_, record: IRule) => <p>{record.guild_role_name}</p>,
  },
  {
    key: "requirement",
    title: "Requirement",
    dataIndex: "requirement",
    render: (_, record: IRule) => <RequirementRenderer rule={record} />,
  },
  {
    key: "members",
    title: "Members",
    dataIndex: "members",
    align: "text-right",
    render: (_, record: IRule) => <p>{record.members.length}</p>,
  },
  {
    key: "actions",
    title: "",
    dataIndex: "actions",
    align: "text-right",
    render: (_, record: IRule) => <DropMenu data={record} refetch={key} />,
  },
];

const RequirementRenderer = ({ rule }: { rule: IRule }) => {
  const [extend, setExtend] = useState(false);

  const requirements = useMemo(() => {
    const isValid = Array.isArray(rule.instructions);
    if (!isValid) return [];

    if (rule.instructions.length <= 5) {
      return rule.instructions;
    } else {
      switch (extend) {
        case false:
          return rule.instructions.slice(0, 5);
        case true:
          return rule.instructions;
        default:
          return [];
      }
    }
  }, [rule.instructions, extend]);
  return (
    <div className="space-y-2 my-3">
      {requirements.map((instruction, index) => (
        <Badge
          variant="outline"
          className="block w-fit px-3 py-1 bg-badge rounded-full border border-gray-600"
          key={instruction.id}
        >
          {index !== 0 && (
            <span className="uppercase text-trekn-secondary text-sm">
              {rule.condition}{" "}
            </span>
          )}
          <p className="inline text-sm">
            Own{" "}
            {instruction.collection.type !== InstructionEnum.WHITELIST &&
              instruction.quantity}{" "}
            {instruction.collection.name}
          </p>
        </Badge>
      ))}
      {rule.instructions.length > 5 && !extend && (
        <Badge
          variant="outline"
          className="block w-fit px-3 py-1 bg-transparent rounded-full border border-[#303030] cursor-pointer"
          onClick={() => setExtend(true)}
        >
          <span className="text-white font-thin text-sm flex justify-center items-center">
            {rule.instructions.length - 5}+ requirements {DownArrowIcon}
          </span>
        </Badge>
      )}
    </div>
  );
};

export default function TableRules({
  id,
  members,
}: {
  id: string;
  members?: number;
}) {
  const key = `project-rule/project/${id}`;
  const { data: rules } = useSWR(key, fetcher<IRule[]>);

  return (
    <Fragment>
      <div className="space-x-2 mt-4 pl-2">
        <Badge variant="outline" className="px-3 py-1 bg-badge rounded-full">
          <p className="text-base font-medium">
            {rules?.metadata?.length} rules
          </p>
        </Badge>
        <Badge variant="outline" className="px-3 py-1 bg-badge rounded-full">
          <p className="text-base font-medium">{members || 0} members</p>
        </Badge>
      </div>
      <Card className="bg-transparent my-8">
        {!rules?.metadata?.length ? (
          <CardContent className="my-6 flex flex-col items-center space-y-3">
            <h1 className="text-trekn-secondary">No rule created</h1>
            <Link href="/rule?type=create">
              <Button
                className="bg-transparent border-button-border"
                size="lg"
                variant="outline"
              >
                Add a rule
              </Button>
            </Link>
          </CardContent>
        ) : (
          <Table
            columns={columns(key)}
            data={rules.metadata as unknown as Data[]}
          />
        )}
      </Card>
    </Fragment>
  );
}
