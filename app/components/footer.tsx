import cn from "classnames";
const TodaysLunch: any = {
  Monday: "Maxmål",
  Tuesday: "Originalmål",
  Wednesday: "Friscomål",
  Thursday: "Maxmål",
  Friday: "Originalmål",
  Saturday: " ",
  Sunday: " ",
};
const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

function Footer() {
  return (
    <>
      <div className="max-w-[793px]">
        <div className="flex flex-col">
          <table className="mt-3">
            <thead className="bg-gray-300 ">
              <tr className="grid grid-cols-8">
                <th className="border border-r-0 border-slate-700 py-2 col-span-1 border-b-0">
                  Antal Kvitton
                </th>
                <th className="border border-r-0 border-slate-700 py-2 col-span-1 border-b-0">
                  Summa
                </th>
                <th className="border border-slate-700 py-2 col-span-6 border-b-0">
                  Signatur Passchef
                </th>
              </tr>
            </thead>
            <tbody className="">
              <tr className="grid grid-cols-8">
                <td className="border border-r-0 border-slate-700 py-8"></td>
                <td className="border border-r-0 border-slate-700 py-8"></td>
                <td className="border border-slate-700 py-8 col-span-6"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className=" max-w-fit ">
          <div className="hidden border mt-4 border-slate-500">
            <div className="border p-2 bg-slate-100 flex justify-start align-middle text-start pl-2 font-bold">
              Kommentar
            </div>
            <div className="">
              <div
                className="w-full h-full align-middle py-5 focus:outline-none text-3xl font-bold"
                contentEditable={true}
                suppressContentEditableWarning={true}
              ></div>
            </div>
          </div>
          <div className="flex text-left text-sm mt-4">
            <div
              className={cn("mr-3 whitespace-nowrap", {
                hidden: day == "Saturday" || day == "Sunday",
              })}
            >
              <div>
                <span className="block text-left font-bold border-b-2 border-slate-900">
                  Dagens Lunch
                </span>
                <span className="block text-left pt-1">
                  <div
                    className="focus:outline-none"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                  >
                    {TodaysLunch[day]}
                    {" / BBQ Plant Beef"}
                  </div>
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <span className="block text-left font-bold border-b-2 border-slate-900 mb-2">
                  Bemanningspolicys
                </span>
                <span className="">
                  Restaurangen får inte vara öppen utan godkänd arbetsledare.
                  Vid fler än en arbetsledare i produktionen ska minst en av
                  dessa alltid bemanna kassa, express, back kassa/drive eller
                  servering. Vid bemanning om sex personer eller fler måste
                  minst en person vara bemannad i serveringen
                </span>
              </div>
              <div>
                <span className="block text-left mt-2 font-bold border-b-2 border-slate-900 mb-2">
                  Arbetsmiljö
                </span>
                <span>
                  Ur ett ergonomiskt arbetssätt bör du byta station vid pass
                  längre än 4h.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Footer;
