//TODO Check if session id is valid then continue
//TODO Use RouteGaurd and insure that SESSIONID is valid

import Head from "next/head";
import type { NextPage } from "next";
import Table from "../components/table";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const Home: NextPage = (data) => {
  return (
    <div className="flex justify-center font_Mulish text-center text-xs print:justify-start">
      <Head>
        <title>BemanningsPlan</title>
      </Head>
      <main>
        <div>
          <Table data={data} />
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps({ req, res }: { req: NextRequest; res: NextResponse }) {
  //------------------ Get Start and End Date ------------------//
  let date = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ");
  let startDate = date[0];
  let endDate = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ")[0];

  // @ts-ignore
  let sessionId = req.cookies.SESSIONID;

  //------------------ Validate Session Id ------------------//
  const validateToken = async () => {
    let response = await axios
      .request({
        url: "https://web.quinyx.com/extapi/authenticated",
        method: "get",
        headers: {
          // @ts-ignore
          Cookie: `SESSIONID=${sessionId}`,
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
  if (sessionId == undefined || !isAuthTokenValid) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  //------------------ Send Request to API ------------------//
  const getData = (url: string) => {
    let response = axios
      .request({
        url: url,
        method: "get",
        headers: {
          // @ts-ignore
          Cookie: `SESSIONID=${sessionId}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        return { Code: 401, message: "unauthorized" };
      });
    return response;
  };

  // ------------------ Get Restuarants Id ------------------//
  let group = await getData("https://web.quinyx.com/extapi/v1/organisation/groups?")
    .then((result) => {
      if (result.Code == 401) return { id: 0 };
      return result
        .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
        .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
        .filter((x: any) => x.defaultGroup == true)[0];
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  // ------------------ Get Schedule and Forecast API Links------------------//
  let schedule = `https://web.quinyx.com/extapi/v1/schedule/shifts/by-group/${group.id}?endDate=${endDate}T06:00:00&startDate=${startDate}T06:00:00`;
  let forecast = `https://web.quinyx.com/extapi/v1/forecast-calculation/groups/${group.id}/forecast-data?end=${endDate}T05:00:00&start=${startDate}T08:00:00&variableIds=395&variableIds=397`;

  // ------------------ Get Schedule ------------------//
  let scheduleData = await getData(schedule)
    .then((response) => {
      if (response.Code == 401) {
        return {};
      }
      return response;
    })
    .catch((err) => {
      return {};
    });

  // ------------------ Get Forecast ------------------//
  let forecastData = await getData(forecast)
    .then((response) => {
      if (response.Code == 401) {
        return {};
      }
      return response;
    })
    .catch((err) => {
      return {};
    });

  return { props: { shifts: scheduleData, forecast: forecastData } };
}

export default Home;
