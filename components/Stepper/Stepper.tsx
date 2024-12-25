"use client";
import { TickIcon } from "@/const";
import React, { Dispatch, SetStateAction, useMemo } from "react";

interface StepperProps {
  steps: Array<{ label: string; description: string }>;
  stepIndex: number;
  setStepIndex?: Dispatch<SetStateAction<number>>;
}

interface CircleStepProps {
  stepStatus: string;
}

const CircleStep: React.FC<CircleStepProps> = ({ stepStatus }) => {
  const stepUI = useMemo(() => {
    switch (stepStatus) {
      case "greater":
        return (
          <div className="bg-white w-10 h-10 rounded-full p-1 z-10 border-[1px] flex justify-center items-center border-black">
            {TickIcon}
          </div>
        );
      case "equal":
        return (
          <div className="bg-white p-[1px] rounded-full">
            <div className="bg-white w-[38px] h-[38px] rounded-full z-10 border-[1px] flex justify-center items-center border-black">
              <div className="h-5 w-5 rounded-full border-[1px] bg-white border-black z-20"></div>
            </div>
          </div>
        );
      case "less":
        return (
          <div className="w-10 h-10 rounded-full p-1 z-10 bg-[#1E1E1E] border-[1px] flex justify-center items-center border-[#767676]">
            <div className="w-1 h-1 rounded-full bg-white flex"></div>
          </div>
        );
      default:
        return null;
    }
  }, [stepStatus]);

  return stepUI;
};

const Stepper: React.FC<StepperProps> = ({
  steps,
  stepIndex,
  setStepIndex,
}) => {
  const stepStatusList = useMemo(() => {
    return steps.map((_, idx) => {
      if (stepIndex > idx) {
        return "greater";
      } else if (stepIndex === idx) {
        return "equal";
      } else {
        return "less";
      }
    });
  }, [steps, stepIndex]);

  return (
    <div className="relative flex flex-col justify-center gap-16">
      <div
        className="h-[22.5%] p-[1px] ml-5 absolute z-0 bg-[#767676]"
        style={{
          height: `${22.5 * steps.length}%`,
        }}
      ></div>
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="flex z-10 items-center cursor-pointer"
          onClick={() =>
            setStepIndex && stepStatusList[idx] !== "less" && setStepIndex(idx)
          }
        >
          <CircleStep stepStatus={stepStatusList[idx]} />
          <div className="ml-3">
            <h3 className="text-sm leading-6 font-medium text-white">
              {step.label}
            </h3>
            <p className="text-xs leading-6 font-medium text-trekn-secondary">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
