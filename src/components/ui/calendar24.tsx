"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Calendar24Props {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  time?: string
  onTimeChange?: (time: string) => void
}

export function Calendar24({ 
  date, 
  onDateChange, 
  time = "10:30:00", 
  onTimeChange 
}: Calendar24Props) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date)
  const [internalTime, setInternalTime] = React.useState(time)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setInternalDate(selectedDate)
    onDateChange?.(selectedDate)
  }

  const handleTimeChange = (newTime: string) => {
    setInternalTime(newTime)
    onTimeChange?.(newTime)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10",
                !internalDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {internalDate ? format(internalDate, "dd/MM/yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-background border shadow-md" 
            align="start" 
            sideOffset={8}
            avoidCollisions={true}
          >
            <div className="p-3">
              <Calendar
                mode="single"
                selected={internalDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
                className="rounded-md"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Time</Label>
        <Input
          type="time"
          value={internalTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full h-10"
        />
      </div>
    </div>
  )
}