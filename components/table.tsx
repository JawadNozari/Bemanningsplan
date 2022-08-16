import cn from "classnames";
import Footer from "./footer";
import SalesChart from "./salesChart";
import useAxios from "../Hooks/useAxios";

type shiftInf = {
  empId: number;
  workingHours: string;
  isBookedByMe: boolean;
  responsibility: string;
  id: number;
  firstName: string;
  lastName: string;
  primaryStaion: string;
  secondaryStation: string;
  haveScheduledBreak: boolean;
  receiptNumber: number;
  amount: number;
};

function Table() {
  const { data, loading } = useAxios("/api/schema");
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
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data.length > 0 ? (
            <div className="text-xs text-center font-Mulish ml-12 my-8 print:my-0 ">
              <div className="block header">
                <div className="flex justify-between">
                  <span className="flex text-xl">BEMANNINGSPLAN</span>
                  <span className="flex items-center font-bold text-sm">
                    <>{getDate()}</>
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
                              <th
                                key={i}
                                className="border min-w-[5em] border-slate-700 py-[0.5em] px-1 print:whitespace-nowrap"
                              >
                                {row.label}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="striped">
                        {data.map((person: shiftInf, i) => {
                          return (
                            <tr key={i} className="border border-slate-700">
                              <td className="py-[0.5em]  px-2 whitespace-nowrap">
                                <div
                                  className="focus:outline-none"
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                >
                                  {person.workingHours}
                                </div>
                              </td>
                              <td className="border border-slate-700 min-w-[10em]">
                                <div
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                  className={cn("px-2 focus:outline-none", {
                                    "uppercase font-light":
                                      person.responsibility == "Dagchef" ||
                                      person.responsibility ==
                                        "Eftermiddagschef" ||
                                      person.responsibility == "Kvällschef" ||
                                      person.responsibility == "Nattchef",
                                  })}
                                >
                                  {person.firstName}
                                </div>
                              </td>
                              <td className="border border-slate-700 px-1 min-w-[8em]">
                                <div
                                  className="focus:outline-none"
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                >
                                  {person.primaryStaion}
                                </div>
                              </td>
                              <td className="px-1">
                                <div
                                  className="focus:outline-none min-w-[8em]"
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                >
                                  {person.secondaryStation}
                                </div>
                              </td>
                              <td className="border border-slate-700">
                                <div
                                  className="focus:outline-none px-2 whitespace-nowrap"
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                >
                                  {person.responsibility}
                                </div>
                              </td>
                              <td className="px-1">
                                <div
                                  className="focus:outline-none px-2"
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                >
                                  {person.haveScheduledBreak ? "" : "x"}
                                </div>
                              </td>
                              <td className="border border-slate-700">
                                <div
                                  className="focus:outline-none"
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                >
                                  {person.receiptNumber}
                                </div>
                              </td>
                              <td className="">
                                <div
                                  className="focus:outline-none"
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                >
                                  {person.amount}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {[...Array(4)].map((_, i) => {
                          return (
                            <tr key={i} className="border border-slate-700">
                              <>
                                {[...Array(8)].map((_, i) => {
                                  return (
                                    <td
                                      key={i}
                                      className="border py-[0.5em] border-slate-700"
                                    >
                                      <div
                                        className="focus:outline-none"
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                      ></div>
                                    </td>
                                  );
                                })}
                              </>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <Footer />
                </div>
                <SalesChart personCount={data.length} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen font-bold flex-col">
              <div>
                <p className="text-4xl text-red-500">Error 500</p>
                <p className="text-2xl">Internal server Error</p>
                <p className="text-2xl">
                  Please try again later or contact the system administrator
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
function getDate() {
  const date = new Date();
  const weekDay = date.toLocaleDateString("sv-SE", { weekday: "long" });
  return (
    weekDay.charAt(0).toLocaleUpperCase() +
    weekDay.slice(1) +
    " " +
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate()
  );
}
export default Table;
