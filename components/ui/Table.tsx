import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn/ui

interface TableProps {
  data: {
    headers: string[];
    rows: string[][];
  };
  className?: string;
}

export const Table: React.FC<TableProps> = ({ data, className }) => {
  return (
    <table
      className={cn(
        "w-full border-collapse border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th
              key={index}
              className="border border-gray-200 bg-gray-100 px-4 py-2 text-left font-semibold dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="border border-gray-200 px-4 py-2 dark:border-gray-700 dark:text-white"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
