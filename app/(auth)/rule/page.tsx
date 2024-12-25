/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import CloseCircleBtn from "@/components/CloseCircleBtn/CloseCircleBtn";
import Stepper from "@/components/Stepper/Stepper";
import { RuleStep } from "@/const";
import { IRule, RuleCondition } from "@/interface/rule.interface";
import { IInstruction } from "@/interface/rule_instruction.interface";
import { fetcher } from "@/util/api";
import { MakeOptional } from "@/util/type.utils";
import { Scroll } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";
import AssignRoleStep from "./_components/AssignRoleStep";
import SelectCollectionStep from "./_components/SelectCollectionStep";
import SetRequirementStep from "./_components/SetRequirementStep";

enum RulePageType {
  CREATE = "create",
  EDIT = "edit",
}

const steps = [
  {
    label: "Allow access",
    description: "Define who will get access",
  },
  { label: "Set requirements", description: "Setup the logic" },
  { label: "Add rules", description: "Define condition for rules" },
];

type CreateInstruction = MakeOptional<
  IInstruction,
  | "id"
  | "rule_id"
  | "collection_id"
  | "is_deleted"
  | "created_at"
  | "updated_at"
>;

export type RulePageState = {
  id?: string;
  type: RulePageType;
  ruleInstruction: CreateInstruction[];
  conditions: RuleCondition;
  assigneeRoleId: string;
  guildName?: string;
  guildColor?: string;
  guildIcon?: string;
};

export default function RulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as RulePageType;
  const rule_id = searchParams.get("id") as string;
  const key = rule_id ? `/project-rule/${rule_id}` : null;

  if (!type) {
    router.push("/");
  }

  const [state, setState] = useState<RulePageState>({
    type: type,
    ruleInstruction: [],
    conditions: RuleCondition.ONLY,
    assigneeRoleId: "",
  });
  const [stepIndex, setStepIndex] = useState<number>(RuleStep.allowedAccess);

  const { data: rule, isLoading } = useSWR(key, fetcher<IRule>);

  useEffect(() => {
    if (rule) {
      setState({
        id: rule.metadata.id,
        type: type,
        ruleInstruction: rule.metadata.instructions.map((instruction) => ({
          type: instruction.type,
          quantity: instruction.quantity,
          collection: instruction.collection,
          id: instruction.id,
          rule_id: instruction.rule_id,
        })),
        conditions: rule.metadata.condition,
        assigneeRoleId: rule.metadata.assignee_role_id,
        guildName: rule.metadata.guild_role_name,
        guildColor: rule.metadata.guild_role_color,
        guildIcon: rule.metadata.guild_role_icon,
      });
    }
  }, [rule]);

  const nextStep = () => {
    setStepIndex((prev) => prev + 1);
  };

  return (
    <main className="grid grid-cols-4 grid-rows-1 w-full">
      {/* stepNap */}
      <nav className="col-span-1 flex items-center ml-14 h-[90vh]">
        <Stepper
          steps={steps}
          stepIndex={stepIndex}
          setStepIndex={setStepIndex}
        />
      </nav>
      {/* content */}
      <div className="col-span-3">
        <div className="w-2/3">
          <div className="w-full flex justify-between">
            <div className="space-y-3">
              <div className="w-fit border border-trekn-secondary border-dashed rounded-full">
                <span className="p-4 block">
                  <Scroll className="w-6 h-6" />
                </span>
              </div>
              <h1 className="font-medium text-trekn-secondary">
                Create a new rule
              </h1>
            </div>
            <div className="space-y-3 flex flex-col items-center cursor-pointer">
              <CloseCircleBtn size="lg" />
              <h1>ESC</h1>
            </div>
          </div>
        </div>
        {/* Step */}
        <div className="mt-8">
          {!isLoading && (
            <StepSwitch
              state={state}
              setState={setState}
              nextStep={nextStep}
              stepIndex={stepIndex}
            />
          )}
        </div>
      </div>
    </main>
  );
}

const StepSwitch = ({
  state,
  setState,
  stepIndex,
  nextStep,
}: {
  state: RulePageState;
  setState: Dispatch<SetStateAction<RulePageState>>;
  stepIndex: number;
  nextStep: () => void;
}) => {
  switch (stepIndex) {
    case RuleStep.allowedAccess:
      return (
        <SelectCollectionStep
          state={state}
          nextStep={nextStep}
          setState={setState}
        />
      );
    case RuleStep.setRequirement:
      return (
        <SetRequirementStep
          state={state}
          setState={setState}
          nextStep={nextStep}
        />
      );
    case RuleStep.addRule:
      return <AssignRoleStep state={state} setState={setState} />;
    default:
      return null;
  }
};
