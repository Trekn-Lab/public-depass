import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IRule } from "@/interface/rule.interface";
import { Download, Edit2, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { deleteRule } from "../rule/actions";
import AlertDialogDelete from "./AlertDialogDelete";
import { useSWRConfig } from "swr";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

export default function DropMenu({
  data,
  refetch,
}: {
  data: IRule;
  refetch: string;
}) {
  const { mutate } = useSWRConfig();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDelete = async (type: "confirm" | "cancel") => {
    if (type === "confirm") {
      const res = await deleteRule(data.id);
      if (res.success) {
        mutate(refetch);
        toast({
          title: "Success",
          description: "Rule has been deleted",
        });
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleExport = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data.members);

      if (!worksheet) throw new Error("Failed to create worksheet.");

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        data.guild_role_name || "Sheet1"
      );
      XLSX.writeFile(workbook, `${data.guild_role_name || "Export"}.xlsx`);

      console.log("File export successful");
    } catch (error) {
      console.error("Error exporting file:", error);

      alert("There was an error exporting the file. Please try again.");
    }
  };

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/rule?type=edit&id=${data.id}`}>
            <DropdownMenuItem>
              <Edit2 className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogDelete
        open={isDeleteDialogOpen}
        onCancel={() => handleDelete("cancel")}
        onConfirm={() => handleDelete("confirm")}
      />
    </Fragment>
  );
}
