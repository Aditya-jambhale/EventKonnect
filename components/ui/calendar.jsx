"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 border border-purple-500/30 shadow-lg rounded-xl hover:shadow-purple-500/40 transition-all duration-300",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center text-purple-700 font-semibold",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:text-purple-700 hover:scale-110 transition-all"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-purple-200 [&:has([aria-selected].day-outside)]:bg-purple-100 [&:has([aria-selected].day-range-end)]:rounded-r-md transition-all hover:scale-105 hover:bg-purple-300",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-purple-500 hover:text-white transition-all duration-300 rounded-lg"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white",
        day_today: "bg-purple-300 text-purple-800 font-bold",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-purple-100 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-purple-400 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft
            className={cn("h-4 w-4 text-purple-500 hover:text-purple-700 transition-all", className)}
            {...props}
          />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight
            className={cn("h-4 w-4 text-purple-500 hover:text-purple-700 transition-all", className)}
            {...props}
          />
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
