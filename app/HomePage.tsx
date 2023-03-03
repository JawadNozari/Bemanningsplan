import axios from "axios";
import React from "react";
import { cookies } from "next/headers";
import Table from "./components/table";
import { redirect } from "next/navigation";
import { Logger } from "../utilities/Logger";

import { formatDate } from "./components/formatDate";

export default async function HomePage(props: any) {
  const SESSIONID = cookies().get("SESSIONID")?.value;
  const query = props.searchParams;

  let startDate = query.startDate;
  let endDate = query.endDate;
  let startHour = query.startHour;
  let endHour = query.endHour;

  if (startDate == undefined || endDate == undefined) {
    let today = new Date();
    startDate = formatDate(today).startDate; // Need To Add safety check for date
    endDate = formatDate(today).endDate;
    startHour = "06:00";
    endHour = "06:00";
  }

  let dates = { startDate, endDate, startHour, endHour };

  const validateToken = async () => {
    let response = await axios
      .request({
        url: "https://web.quinyx.com/extapi/authenticated",
        method: "get",
        headers: {
          // @ts-ignore
          Cookie: `SESSIONID=${SESSIONID}`,
        },
      })
      .then((response) => {
        return response.status == 200 ? true : false;
      })
      .catch((err) => {
        return false;
      });
    return response;
  };

  let isAuthTokenValid = await validateToken();
  if (SESSIONID == undefined || !isAuthTokenValid) {
    redirect("/login");
  }

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Table sessionId={SESSIONID} dates={dates} />
    </>
  );
}
