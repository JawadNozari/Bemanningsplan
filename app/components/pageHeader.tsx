"use client";

import { sv } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { formatDate } from "./formatDate";
import { format, isValid, parse } from "date-fns";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TableHead(props: any) {
  const urldate = props.date.split("T")[0];
  const [date, setDate] = useState<Date>(new Date(urldate));
  const [inputValue, setInputValue] = useState<string>("");
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const Router = useRouter();
  useEffect(() => {
    if (date) {
      setInputValue(format(date, "y-MM-dd"));
    } else {
      setInputValue(format(new Date(urldate), "y-MM-dd"));
    }
    let fDate = formatDate(date);
    Router.push(`/?startDate=${fDate.startDate}&endDate=${fDate.endDate}`);
    // eslint-disable-next-line
  }, [date]);

  function getDate() {
    let d = new Date(date);
    const weekDay = d.toLocaleDateString("sv-SE", { weekday: "long" });
    return `${weekDay.charAt(0).toLocaleUpperCase()}${weekDay.slice(1)} ${d.toLocaleDateString("sv-SE").split("T")[0]}`;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <span className="flex text-xl">BEMANNINGSPLAN</span>
          <span className="flex items-center font-bold text-sm">
            <>
              <div className="hidden print:flex">
                <>{getDate()}</>
              </div>

              <div className="print:hidden">
                <>
                  <div>
                    <div className="flex p-2 rounded-md bg-gray-200 ">
                      <input
                        type="text"
                        placeholder={format(new Date(), "y-MM-dd")}
                        value={inputValue}
                        readOnly
                        // onChange={handleInputChange}
                        className="bg-inherit text-black outline-none placeholder:text-black placeholder:opacity-100 pointer-events-none "
                      />
                      <button type="button" className="" aria-label="Pick a date" onClick={() => setIsPopperOpen(true)}>
                        <span role="img" aria-label="calendar icon" className="text-xl">
                          📅
                        </span>
                      </button>
                    </div>
                    {isPopperOpen && (
                      <>
                        <div
                          className="fixed top-0 left-0 bottom-0 right-0 md:top-0 md:left-0 md:right-0 md:bottom-0  bg-gray-800 bg-opacity-50 backdrop-blur-sm"
                          onClick={(e) => {
                            if (isPopperOpen && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                              setIsPopperOpen(false);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (isPopperOpen && e.key === "Escape") {
                              setIsPopperOpen(false);
                            }
                          }}
                          tabIndex={-1}
                        >
                          <div className="flex justify-center items-center h-screen">
                            <div
                              className="bg-gradient-to-bl from-black to-slate-700 text-white rounded-3xl md:p-6 m-2"
                              onKeyDown={(e) => e.stopPropagation()}
                              ref={buttonRef}
                            >
                              <DayPicker
                                showWeekNumber
                                locale={sv}
                                initialFocus={isPopperOpen}
                                mode="single"
                                defaultMonth={date}
                                selected={date}
                                onSelect={(date) => {
                                  setDate(date!);
                                  setIsPopperOpen(false);
                                }}
                                modifiersClassNames={{
                                  today: "!text-gray-400 !bg-gray-200 !bg-opacity-20",
                                  selected: "!bg-red-500 !text-white ",
                                  active: "!bg-red-100 !text-gray-500",
                                }}
                                className="md:p-6 p-2"
                                footer={
                                  <div className="flex justify-between items-center pt-4">
                                    <button
                                      type="button"
                                      className="bg-sky-700 text-white rounded-full px-6 py-2"
                                      onClick={() => {
                                        setIsPopperOpen(false);
                                      }}
                                    >
                                      Close
                                    </button>
                                  </div>
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              </div>

              <button
                className="print:hidden flex justify-center items-center bg-gradient-to-tr from-cyan-700 to-sky-500 text-white rounded-full px-6 py-2 ml-9"
                onClick={handlePrint}
              >
                <span role="img" aria-label="calendar icon" className="text-xl">
                  🖨️
                </span>
                {/* <Image src="/assets/printer.svg" alt="printer" width={25} height={25} /> */}
                <p className="pl-2">Print</p>
              </button>
            </>
          </span>
        </div>
        <span className="flex place-content-start">version 2.2</span>
      </div>
    </>
  );
}
