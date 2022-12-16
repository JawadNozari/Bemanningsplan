//! Cookie from web.quinyx.com is needed for the API to work
//! Quinyx API requires a API Session to work
//? Look for auth-prod with domain 'quinyx.com' res.data.cookie
//? Look for api_session with domain 'app.quinyx.com'

import qs from "qs";
import axios from "axios";
import cheerio from "cheerio";
import { header } from "./requestHeader";
import { CookieJar, Cookie } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let date = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ");
  let startDate = date[0];
  let endDate = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ")[0];

  if (req.body.userName != null && req.body.password != null) {
    //   //TODO This Part shoud done on client side before sending request to API
    let AuthUrl = "";
    let Response = "";
    let RelayState = "";
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));
    const url = await client.get("https://schema.max.se").then((response) => {
      const $ = cheerio.load(response.data);
      const SAML = $("#loginForm").attr("action");
      const SAML_URL = "https://sts.max.se" + SAML;
      return SAML_URL;
    });
    const credentials = qs.stringify({
      Kmsi: "true",
      Password: req.body.password,
      UserName: `${req.body.userName}@max.se`,
      AuthMethod: "FormsAuthentication",
    });
    await client
      .post(url, credentials, {
        headers: header("sts.max.se", "application/x-www-form-urlencoded"),
      })
      .then((response) => {
        const $ = cheerio.load(response.data);
        AuthUrl = $("Form").attr("action") ?? "";
        Response = $("input[name=SAMLResponse]").attr("value") ?? "";
        RelayState = $("input[name=RelayState]").attr("value") ?? "";
        return;
      });
    if (AuthUrl != "" && Response != "" && RelayState != "") {
      const samlData = qs.stringify({
        RelayState: RelayState,
        SAMLResponse: Response,
      });
      await client
        .post(AuthUrl, samlData, {
          headers: header("app.quinyx.com", "application/x-www-form-urlencoded"),
        })
        .then((response) => {
          return response.data;
        });

      const user = await client.get("https://web.quinyx.com/extapi/authenticated").then((res) => {
        let authenticatedUser = `${res.data.firstname} ${res.data.lastname}`;
        return authenticatedUser;
      });

      const group = await client.get("https://web.quinyx.com/extapi/v1/organisation/groups?").then((resp) => {
        let group = resp.data
          .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
          .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
          .filter((x: any) => x.defaultGroup == true)[0];
        return group;
      });
      let schedule = `https://web.quinyx.com/extapi/v1/schedule/shifts/by-group/${group.id}?endDate=${endDate}T06:00:00&startDate=${startDate}T06:00:00`;
      let forecast = `https://web.quinyx.com/extapi/v1/forecast-calculation/groups/${group.id}/forecast-data?end=${endDate}T05:00:00&start=${startDate}T08:00:00&variableIds=395&variableIds=397`;
      let shifts = await client
        .get(schedule)
        .then((resp) => {
          return resp.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
      let forecastData = await client
        .get(forecast)
        .then((resp) => {
          return resp.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });

      console.log(`Responded Successfully to \x1b[32m${user}\x1b[0m from Restaurang \x1b[33m${group.name}\x1b[0m`);
      res.status(200).send({ shifts: shifts, forecastdata: forecastData });
      return;
    }
  }
  res.status(400).send("Credentials were not provided");
  return;
}
