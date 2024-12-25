/* eslint-disable @next/next/no-img-element */
"use client";
import HorizontalScroll from "@/components/common/HorizontalScroll";
import Table, { Columns } from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RuleCondition } from "@/interface/rule.interface";
import { Dispatch, Fragment, SetStateAction, useState, useMemo } from "react";
import { RulePageState } from "../page";
import CollectionChip from "./CollectionChip";
import { InstructionEnum } from "@/interface/rule_instruction.interface";

const columns = (
  setState: Dispatch<SetStateAction<RulePageState>>,
  isChecked: boolean,
  isValidate: string[]
): Columns[] => [
  {
    key: "requirement",
    title: "Requirements",
    dataIndex: "requirement",
    render: (value, record) => (
      <div className="flex items-center">
        {record.icon && (
          <img
            src={record.icon}
            alt={record.requirement}
            width={32}
            height={32}
            className="rounded-sm"
          />
        )}
        <span className="ml-2 text-lg font-semibold">{value}</span>
      </div>
    ),
  },
  {
    key: "amount",
    title: "Amount",
    dataIndex: "amount",
    align: "text-right",
    width: 200,
    render: (value, record) =>
      record.unit !== InstructionEnum.WHITELIST && (
        <>
          <Input
            type="number"
            className="text-end w-[200px]"
            defaultValue={value}
            min={0}
            onChange={(e) => {
              const amount = parseInt(e.target.value);
              setState((prev) => ({
                ...prev,
                ruleInstruction: prev.ruleInstruction.map((instruction) =>
                  instruction.collection.id === record.key
                    ? { ...instruction, quantity: amount }
                    : instruction
                ),
              }));
            }}
          />
          {isChecked && isValidate.includes(record.key) && (
            <div className="w-[200px] text-end pt-1">
              <span className="text-thin text-sm text-red-500">
                Amount must be greater than 0
              </span>
            </div>
          )}
        </>
      ),
  },
  {
    key: "unit",
    title: "Unit",
    align: "text-right",
    dataIndex: "unit",
  },
];

export default function SetRequirementStep({
  state,
  setState,
  nextStep,
}: {
  state: RulePageState;
  setState: Dispatch<SetStateAction<RulePageState>>;
  nextStep: () => void;
}) {
  const [ischecked, setCheck] = useState<boolean>(false);
  const data = state.ruleInstruction.map((instruction) => ({
    key: instruction.collection.id,
    icon: instruction.collection.icon,
    requirement: instruction.collection.name,
    amount: instruction.quantity,
    unit: instruction.collection.type,
  }));

  const handleChangeCondition = (value: RuleCondition) => {
    setState((prev) => ({ ...prev, conditions: value }));
  };

  const instructionIdList = useMemo(() => {
    const instructionList = state.ruleInstruction.filter(
      (instruction) =>
        instruction.type !== InstructionEnum.WHITELIST &&
        (!instruction.quantity || instruction.quantity <= 0)
    );

    return instructionList.map((instruction) => instruction.collection.id);
  }, [state.ruleInstruction]);

  const handleNextStep = () => {
    setCheck(true);

    if (instructionIdList.length === 0) {
      nextStep();
    }
  };

  return (
    <main className="w-2/3">
      <h1 className="text-4xl font-bold">Set requirements</h1>
      <div className="mt-8">
        <h3 className="text-trekn-secondary">People need to hold</h3>
        <HorizontalScroll className="items-center mt-2">
          {state.ruleInstruction.map((instruction, idx) => (
            <Fragment key={instruction.collection.id}>
              <CollectionChip
                name={instruction.collection.name}
                icon={instruction.collection.icon}
              />
              {idx !== state.ruleInstruction.length - 1 && (
                <Select
                  onValueChange={(value: RuleCondition) =>
                    handleChangeCondition(value)
                  }
                  value={state.conditions}
                >
                  <SelectTrigger className="w-fit h-6 bg-white text-black rounded-full">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RuleCondition.AND}>AND</SelectItem>
                    <SelectItem value={RuleCondition.OR}>OR</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Fragment>
          ))}
        </HorizontalScroll>
        <Table
          className="mt-8"
          columns={columns(setState, ischecked, instructionIdList)}
          data={data}
        />
      </div>
      <Button onClick={handleNextStep} size="lg" className="mt-8">
        Continue
      </Button>
    </main>
  );
}
