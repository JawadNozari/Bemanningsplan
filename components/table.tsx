import cn from "classnames";
import Footer from "./footer";
import SalesChart from "./salesChart";
import EmptyRow from "./emptyRow";

type shiftinf = {
  id: number;
  worker: {
    id: number;
    firstname: string;
    lastname: string;
  };
  begin: string;
  end: string;
  status: string;
  breaks: Array<object>;
  shiftTypeId: number;
};

function Table(props: any) {
  function getDate() {
    const date = new Date();
    const weekDay = date.toLocaleDateString("sv-SE", { weekday: "long" });
    return `${weekDay.charAt(0).toLocaleUpperCase()}${weekDay.slice(1)} ${date.toISOString().split("T")[0]}`;
  }

  if (props.BData.data === undefined || props.BData.data.shifts === undefined) {
    return (
      <div className="flex justify-center items-center h-screen font-bold flex-col">
        <div>
          <p className="text-5xl text-red-500 pb-4">This Page is down for maintenance</p>
          <p className="text-3xl pb-1">scheduled to be done: Monday 2022/12/19 </p>
          <p className="text-2xl pb-4">contact: contact@jawadnozari.com</p>
        </div>
      </div>
    );
  }

  let data = props.BData.data.shifts.sort((a: any, b: any) => (a.begin > b.begin ? 1 : -1));
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
      {data.length > 0 ? (
        <div className="text-xs text-center font-Mulish ml-12 my-8 print:my-0">
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
                          <th key={i} className="border bg-gray-300 border-slate-700 py-[0.5em] px-1 print:whitespace-nowrap">
                            {row.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((shift: shiftinf, i: number) => {
                      return (
                        <tr key={i} className="border border-slate-700">
                          <td className="py-[0.5em]  px-2 whitespace-nowrap">
                            <div className="focus:outline-none" contentEditable={true} suppressContentEditableWarning={true}>
                              {shift.begin.split("T")[1].slice(0, -3)} - {shift.end.split("T")[1].slice(0, -3)}
                            </div>
                          </td>
                          <td className="border border-slate-700 min-w-[10em]">
                            <div
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              className={cn("px-1 focus:outline-none", {
                                "uppercase font-bold":
                                  shift.shiftTypeId == 370737 ||
                                  shift.shiftTypeId == 370738 ||
                                  shift.shiftTypeId == 370739 ||
                                  shift.shiftTypeId == 370740,
                              })}
                            >
                              {shift.status == "UNASSIGNED" ? "" : shift.worker.firstname}
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
                              {shift.shiftTypeId == 370737
                                ? "Dagchef"
                                : "" || shift.shiftTypeId == 370738
                                ? "Eftermiddagschef"
                                : "" || shift.shiftTypeId == 370739
                                ? "Kvällschef"
                                : "" || shift.shiftTypeId == 370740
                                ? "Nattchef"
                                : "" || shift.shiftTypeId == 370757
                                ? "Leverans"
                                : "" || shift.shiftTypeId == 370768
                                ? "Serveringsvärd"
                                : "" || shift.shiftTypeId == 370744
                                ? "Upplärning"
                                : "" || shift.shiftTypeId == 370753
                                ? "Inventering"
                                : ""}
                            </div>
                          </td>
                          <td className="px-1">
                            <div className="focus:outline-none px-2" contentEditable={true} suppressContentEditableWarning={true}>
                              {shift.breaks.length ? "" : "x"}
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
                    <EmptyRow quantity={6} />
                  </tbody>
                </table>
              </div>
              <Footer />
            </div>
            <SalesChart personCount={data.length} forecastdata={props.BData.data.forecastdata} />
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
