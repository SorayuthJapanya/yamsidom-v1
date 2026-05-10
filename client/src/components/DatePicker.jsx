import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { th } from "date-fns/locale";

const DatePicker = ({ selectedDate, setSelectedDate }) => {
  const [open, setOpen] = useState(false);
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setOpen(false);
    };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-52 justify-between font-normal"
        >
          {selectedDate
            ? selectedDate.toLocaleDateString("th-TH")
            : "กรุณาเลือกวันที่"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          captionLayout="dropdown"
          locale={th}
          onSelect={handleDateChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
