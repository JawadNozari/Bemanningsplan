"use client";
// import { sv } from "date-fns/locale";
// import "react-day-picker/dist/style.css";
// import { DayPicker } from "react-day-picker";
// import { format, isValid, parse } from "date-fns";
// import React, { useRef, useState, useEffect } from "react";
// import { formatDate } from "./formatDate";
// import { useRouter } from "next/navigation";

export default function DatePicker(props: any) {
  // const [selected, setSelected] = useState<Date>();
  // const [inputValue, setInputValue] = useState<string>("");
  // const [isPopperOpen, setIsPopperOpen] = useState(false);
  // const [dateModified, setDateModified] = useState(false);
  // const Router = useRouter();
  // const buttonRef = useRef<HTMLDivElement>(null);

  // if (dateModified) {
  //   let mDate = formatDate(selected!.toString());
  //   Router.push(`/?startDate=${mDate.startDate}&endDate=${mDate.endDate}&startHour=${mDate.startHour}&endHour=${mDate.endHour}`);
  // }

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.currentTarget.value);
  //   const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
  //   if (isValid(date)) {
  //     setSelected(date);
  //   } else {
  //     setSelected(new Date());
  //   }
  // };

  // const dialog = isPopperOpen && (
  //   <div
  //     className="absolute z-10 top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center"
  //     onClick={(e) => {
  //       if (isPopperOpen && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
  //         setIsPopperOpen(false);
  //       }
  //     }}
  //     onKeyDown={(e) => {
  //       if (isPopperOpen && e.key === "Escape") {
  //         setIsPopperOpen(false);
  //       }
  //     }}
  //     tabIndex={-1}
  //   >
  //     <div className="bg-gray-900 text-white rounded-2xl shadow-3xl p-6" onKeyDown={(e) => e.stopPropagation()} ref={buttonRef}>
  //       <DayPicker
  //         className=""
  //         showWeekNumber
  //         modifiersClassNames={{
  //           today: "text-gray-400 bg-gray-200 bg-opacity-20",
  //           selected: "bg-red-500 text-white",
  //           active: "bg-red-100 text-gray-500",
  //         }}
  //         locale={sv}
  //         initialFocus={isPopperOpen}
  //         mode="single"
  //         defaultMonth={selected}
  //         selected={selected}
  //         onSelect={(date) => {
  //           setSelected(date);
  //           if (date) {
  //             setInputValue(format(date, "y-MM-dd"));
  //           } else {
  //             setInputValue("");
  //           }
  //           setDateModified(true);
  //           setIsPopperOpen(false);
  //         }}
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <>
      {/* <div>
        <div className="flex w-fit p-2 rounded-md bg-gray-200">
          <input
            type="text"
            placeholder={format(new Date(), "y-MM-dd")}
            value={inputValue}
            onChange={handleInputChange}
            className="bg-inherit text-black"
          />
          <button type="button" className="button-reset ba" aria-label="Pick a date" onClick={() => setIsPopperOpen(true)}>
            <span role="img" aria-label="calendar icon" className="text-xl">
              📅
            </span>
          </button>
        </div>
        {dialog}
      </div> */}
    </>
  );
}
