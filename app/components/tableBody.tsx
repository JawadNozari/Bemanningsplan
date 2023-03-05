import cn from "classnames";
import EmptyRow from "./emptyRow";

export default function TableBody(props: any) {


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
  const schedules = props.schedules;
  return (
    <>
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
    </>
  );
}
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
