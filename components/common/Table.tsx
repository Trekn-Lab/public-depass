/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Table as UITable,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type Columns = {
  key: string;
  title: string;
  dataIndex: string;
  render?: (value: any, record: any) => ReactNode;
  align?: "text-left" | "text-center" | "text-right";
  width?: number;
};

export type Data = {
  key: string;
  [key: string]: ReactNode;
};

type TableProps = {
  className?: string;
  columns: Columns[];
  data: Data[];
};

export default function Table({ columns, data, className }: TableProps) {
  return (
    <div
      className={cn(
        "border border-trekn-default-neutral px-6 py-4 rounded-xl",
        className
      )}
    >
      <UITable>
        <TableHeader className="text-trekn-secondary text-base">
          <TableRow>
            {columns.map((column) => (
              <TableCell
                className={cn(column.align, `w-[${column.width}px]`)}
                key={column.key}
              >
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.key}>
              {columns.map((column) => (
                <TableCell className={cn(column.align)} key={column.key}>
                  {column.render
                    ? column.render(record[column.dataIndex], record)
                    : record[column.dataIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </UITable>
    </div>
  );
}
