import axios from "axios";
import React from "react";
import Head from "next/head";
import type { NextPage } from "next";
import Table from "../components/table";
import { NextRequest } from "next/server";
import { formatDate } from "../components/formatDate";
import { getData } from "../components/getData";

const Home: NextPage = (BemanningsData) => {
  return (
    <div>
      <Head>
        <title>BemanningsPlan</title>
      </Head>
      <div className="flex justify-center font_Mulish text-center text-xs print:justify-start">
        <div>
          <div>
            <Table data={BemanningsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, query }: { req: NextRequest; query: any }) {
  //@ts-ignore
  const { SESSIONID } = req.cookies;
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
    return { redirect: { destination: "/login", permanent: false } };
  }
  let BemanningsData = {};

  if (Object.keys(query).length == 0) {
    let today = new Date().toString();
    let startDate = formatDate(today).startDate;
    let endDate = formatDate(today).endDate;
    let startHour = "06:00";
    let endHour = "06:00";

    let bemanningsDate = { startDate, endDate, startHour, endHour };
    BemanningsData = await getData(SESSIONID, bemanningsDate).then((data) => {
      return data;
    });
  } else {
    let startDate = query.startDate;
    let endDate = query.endDate;
    let startHour = query.startHour;
    let endHour = query.endHour;

    let bemanningsDate = { startDate, endDate, startHour, endHour };
    BemanningsData = await getData(SESSIONID, bemanningsDate).then((data) => {
      return data;
    });
  }

  return { props: { BemanningsData } };
}

export default Home;
