function SalesChart(props: any) {
  const forecast = props.forecastdata[1].aggregatedDataSets;

  const forecastData = forecast
    .map((item: any) => {
      if (item.name === "forecast.uploadedForecastData") {
        return item.data;
      }
    })
    .filter((item: any) => item !== undefined);
  const data = forecastData[0]
    .map((fd: any) => {
      return {
        time: `${fd.start.split("T")[1].slice(0, 2)}-${fd.end.split("T")[1].slice(0, 2)}`,
        value: Math.round(fd.value),
      };
    })
    .filter((data: any) => {
      return data.value != 0;
    });

  let total = 0;
  return (
    <>
      <div className="ml-2 text-center">
        <table className="inline-block">
          <thead>
            <tr className="border border-gray-900">
              <th colSpan={2} className="py-[0.5em]  bg-gray-300">
                Timförsäljning
              </th>
            </tr>
          </thead>
          <tbody className="striped">
            {data.map((sale: any) => {
              total += Math.round(sale.value);
              return (
                <tr key={sale.time}>
                  <td className="border border-slate-700 py-[0.5em]  px-1 whitespace-nowrap">{"KL " + sale.time}</td>
                  <td className="border border-slate-700 whitespace-nowrap min-w-[5em]">
                    <div className="focus:outline-none px-1" contentEditable={true} suppressContentEditableWarning={true}>
                      {sale.value} kr
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="border border-slate-700 py-[0.5em] ">Total</td>
              <td className="border border-slate-700">
                <div className="focus:outline-none px-1 whitespace-nowrap" contentEditable={true} suppressContentEditableWarning={true}>
                  {`${total} kr`}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="block border-slate-700 border rounded-md mt-4">
          <span className="block text-sm">Antal personer</span>
          <span className="text-lg font-bold">
            <div className="focus:outline-none px-2" contentEditable={true} suppressContentEditableWarning={true}>
              {props.personCount}
            </div>
          </span>
        </div>
      </div>
    </>
  );
}
export default SalesChart;
