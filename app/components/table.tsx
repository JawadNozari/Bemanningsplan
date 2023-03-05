import React from "react";
import axios from "axios";
import Footer from "./footer";
import TableBody from "./tableBody";
import { getData } from "./getData";
import TableHead from "./pageHeader";
import SalesChart from "./salesChart";
import ErrorHandler from "./errorHandler";
import { Logger } from "../../utilities/Logger";

async function fetchData(
  sessionId: string,
  dates: { startDate: string; endDate: string; startHour: string | undefined; endHour: string | undefined }
) {
  const group = await axios
    .request({
      url: "https://web.quinyx.com/extapi/v1/organisation/groups?",
      method: "get",
      headers: {
        // @ts-ignore
        Cookie: `SESSIONID=${sessionId}`,
      },
    })
    .then((resp) => {
      let group = resp.data
        .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
        .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
        .filter((x: any) => x.defaultGroup == true)[0];
      return group;
    })
    .catch((err) => {
      Logger(err);
      return;
    });
  let BemanningsData: any;

  let startDate = dates.startDate;
  Logger(`\x1b[33m${group.name}\x1b[0m\nRequested for: \x1b[31m${startDate}\x1b[0m`);

  BemanningsData = await getData(sessionId, dates).then((data) => {
    return data;
  });
  return BemanningsData;
}

export async function Table(props: any) {
  const SESSIONID = props.sessionId;
  const dates = props.dates;
  const data = await fetchData(SESSIONID, dates);

  if (data.schedules === null) {
    let message = {
      info: "We Could not find any data ",
      details: "",
    };
    return <ErrorHandler Message={message} />;
  }
  let schedules = data?.schedules;
  let forecast = data?.forecastData;

  if (schedules[0] === undefined) {
    let message = {
      info: "Schema for this date is not published yet.",
      details: "Ask your RC or BRC for more information",
    };
    return <ErrorHandler Message={message} />;
  }
  let startdate = schedules[0].begin;

  return (
    <>
      {schedules.length > 0 ? (
        <div className="flex justify-center font_Mulish text-center text-xs print:justify-start">
          <div className="text-xs text-center font-Mulish ml-12 my-8 print:my-0">
            <div className="block header">
              <TableHead date={startdate} />
            </div>
            <div className="flex">
              <div className="flex flex-col justify-center ">
                <div>
                  <TableBody schedules={schedules} />
                </div>
                <Footer />
              </div>
              <SalesChart personCount={schedules.length} forecastdata={forecast} />
            </div>
          </div>
        </div>
      ) : (
        <ErrorHandler
          Message={{
            info: "This Page is only optimized to work for restuarant managment team: ",
            details: "RC, BRC, DriftLedare or Trainee",
          }}
        />
      )}
    </>
  );
}
export default Table;
