import "dayjs/locale/sv";
import cn from "classnames";
import Footer from "./footer";
import Image from "next/image";
import Router from "next/router";
import { useState } from "react";
import EmptyRow from "./emptyRow";
import SalesChart from "./salesChart";
import TextField from "@mui/material/TextField";
import { formatDate } from "../components/formatDate";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function Table({ data }: any) {
  const [date, setValue] = useState<Date | null>(new Date());
  const [dateModified, setDateModified] = useState(false);
  function getDate() {
    const d = new Date(date!.toString());
    const weekDay = d.toLocaleDateString("sv-SE", { weekday: "long" });
    return `${weekDay.charAt(0).toLocaleUpperCase()}${weekDay.slice(1)} ${d.toISOString().split("T")[0]}`;
  }
  if (dateModified) {
    Router.push({
      pathname: "/",
      query: formatDate(date!.toString()),
    });
    setDateModified(false);
  }
  let scheduleData = data.BemanningsData.scheduleData;
  let forecastData = data.BemanningsData.forecastData;
  const redirect = () => {
    Router.push("/login");
  };
  if (Object.keys(scheduleData).length === 0 || data == null) {
    return (
      <div className="flex justify-center items-center h-screen font-bold flex-col ">
        <div className="border-red-600">
          <p className="text-3xl text-black pb-1">You are not logged in. </p>
          <p className="text-3xl text-black mb-6">Please log in and try again </p>
          <button
            className="inline-block px-16 py-3 bg-[#e41f18] border-white text-white font-medium text-lg leading-snug uppercase rounded-full"
            onClick={redirect}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  let schedules = scheduleData.sort((a: any, b: any) => (a.begin > b.begin ? 1 : -1));
  const headers = [
    { key: "workingHours", label: "Tid" },
    { key: "name", label: "Namn" },
    { key: "primaryStaion", label: "Primär station" },
    { key: "secondaryStation", label: "Sekundär station" },
    { key: "responsibility", label: "Ansvarsområde" },
    { key: "haveScheduledBreak", label: "Planerad rast" },
    { key: "receiptNumber", label: "Nota" },
    { key: "amount", label: "Summa" },
  ];
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      {schedules.length > 0 ? (
        <div className="text-xs text-center font-Mulish ml-12 my-8 print:my-0">
          <div className="block header">
            <div className="flex justify-between items-center">
              <span className="flex text-xl">BEMANNINGSPLAN</span>
              <span className="flex items-center font-bold text-sm">
                <>
                  <div className="hidden print:flex">
                    <>{getDate()}</>
                  </div>

                  <div className="print:hidden animate-pulsee">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
                      <DatePicker
                        label="välj ett datum"
                        value={date}
                        onChange={(newValue) => {
                          setValue(newValue);
                        }}
                        onClose={() => {
                          setDateModified(true);
                        }}
                        renderInput={(params) => {
                          return <TextField {...params} />;
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                  <button
                    className="print:hidden flex justify-center items-center border bg-slate-700 text-white border-gray-900 rounded-md px-4 py-2 ml-5"
                    onClick={handlePrint}
                  >
                    <Image src="/assets/printer.svg" alt="printer" width={25} height={25} />
                    <p className="pl-2">Print</p>
                  </button>
                </>
              </span>
            </div>
            <span className="flex place-content-start">version 2.2</span>
          </div>
          <div className="flex">
            <div className="flex flex-col justify-center ">
              <div>
                <table className="main_table">
                  <thead>
                    <tr className="header bg-gray-100">
                      {headers.map((row, i) => {
                        return (
                          <th key={i} className="border bg-gray-300 border-slate-700 py-[0.5em] px-1 print:whitespace-nowrap">
                            {row.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((scheduleData: shiftinf, i: number) => {
                      return (
                        <tr key={i} className="border border-slate-700">
                          <td className="py-[0.5em]  px-2 whitespace-nowrap">
                            <div className="focus:outline-none" contentEditable={true} suppressContentEditableWarning={true}>
                              {scheduleData.begin.split("T")[1].slice(0, -3)} - {scheduleData.end.split("T")[1].slice(0, -3)}
                            </div>
                          </td>
                          <td className="border border-slate-700 min-w-[10em]">
                            <div
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              className={cn("px-1 focus:outline-none", {
                                "uppercase font-bold":
                                  scheduleData.shiftTypeId == 370737 ||
                                  scheduleData.shiftTypeId == 370738 ||
                                  scheduleData.shiftTypeId == 370739 ||
                                  scheduleData.shiftTypeId == 370740,
                              })}
                            >
                              {scheduleData.status == "UNASSIGNED" ? "" : scheduleData.worker.firstname}
                            </div>
                          </td>
                          <td className="border border-slate-700 px-1 min-w-[10em]">
                            <div className="focus:outline-none" contentEditable={true} suppressContentEditableWarning={true}></div>
                          </td>
                          <td className="px-1">
                            <div className="focus:outline-none min-w-[8em]" contentEditable={true} suppressContentEditableWarning={true}></div>
                          </td>
                          <td className="border border-slate-700">
                            <div className="focus:outline-none px-2 whitespace-nowrap" contentEditable={true} suppressContentEditableWarning={true}>
                              {scheduleData.shiftTypeId == 370737
                                ? "Dagchef"
                                : "" || scheduleData.shiftTypeId == 370738
                                ? "Eftermiddagschef"
                                : "" || scheduleData.shiftTypeId == 370739
                                ? "Kvällschef"
                                : "" || scheduleData.shiftTypeId == 370740
                                ? "Nattchef"
                                : "" || scheduleData.shiftTypeId == 370757
                                ? "Leverans"
                                : "" || scheduleData.shiftTypeId == 370768
                                ? "Serveringsvärd"
                                : "" || scheduleData.shiftTypeId == 370744
                                ? "Upplärning"
                                : "" || scheduleData.shiftTypeId == 370753
                                ? "Inventering"
                                : ""}
                            </div>
                          </td>
                          <td className="px-1">
                            <div className="focus:outline-none px-2" contentEditable={true} suppressContentEditableWarning={true}>
                              {scheduleData.breaks.length ? "" : "x"}
                            </div>
                          </td>
                          <td className="border border-slate-700 min-w-[6em]">
                            <div className="focus:outline-none" contentEditable={true} suppressContentEditableWarning={true}></div>
                          </td>
                          <td className=" min-w-[6em]">
                            <div className="focus:outline-none" contentEditable={true} suppressContentEditableWarning={true}></div>
                          </td>
                        </tr>
                      );
                    })}
                    <>{schedules.length <= 29 ? <EmptyRow quantity={4} /> : ""}</>
                  </tbody>
                </table>
              </div>
              <Footer />
            </div>
            <SalesChart personCount={schedules.length} forecastdata={forecastData} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen font-bold flex-col">
          <div>
            <p className="text-4xl text-red-500 pb-4">Page is Down For Maintainace</p>
            <p className="text-3xl pb-1">Internal server Error</p>
            <p className="text-3xl pb-5">Please try again later or contact me at :</p>
            <p className="text-2xl">contact@jawadnozari.com</p>
          </div>
        </div>
      )}
    </>
  );
}
export default Table;
type shiftinf = {
  worker: {
    firstname: string;
    lastname: string;
  };
  begin: string;
  end: string;
  status: string;
  breaks: Array<object>;
  shiftTypeId: number;
};
