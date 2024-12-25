import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, CirclePlus, Search } from "lucide-react";
import { useState } from "react";

type ComboBoxSelectCollectionProps = {
  options: {
    value: string;
    label: string;
  }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  onAddRole: () => void;
};

export function ComboBoxSelectCollection({
  options,
  defaultValue,
  onChange,
  onAddRole,
}: ComboBoxSelectCollectionProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-96 h-12 justify-between bg-transparent border-[#404040]"
        >
          {value
            ? options.find((item) => item.value === value)?.label
            : "Select role..."}
          <Search className="ml-2 h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Command
          filter={(value, search) => {
            if (value.includes(search)) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search role available..." />
          <CommandList>
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup className="border-b-[1px] border-[#404040]">
              <CommandItem
                className="flex gap-2 items-center cursor-pointer"
                onSelect={onAddRole}
              >
                Add new role
                <CirclePlus size={12} />
              </CommandItem>
            </CommandGroup>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={`${item.value} ${item.label}`}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue.split(" ")[0]);
                    setValue(currentValue.split(" ")[0] ?? "");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
