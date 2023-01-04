//! Cookie from web.quinyx.com is needed for the API to work
//! Quinyx API requires a API Session to work
//? Look for auth-prod with domain 'quinyx.com' res.data.cookie
//? Look for api_session with domain 'app.quinyx.com'

import qs from "qs";
import axios from "axios";
import cheerio from "cheerio";
import { header } from "./requestHeader";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let date = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ");

  const line = "-".repeat(100);
  if (req.body.userName != null && req.body.password != null) {
    console.log(req.body);
    //TODO This Part shoud done on client side before sending request to API
    let AuthUrl = "";
    let Response = "";
    let RelayState = "";
    const jar = new CookieJar();
    const credentials = qs.stringify({
      Kmsi: "true",
      Password: req.body.password,
      AuthMethod: "FormsAuthentication",
      UserName: `${req.body.userName}@max.se`,
    });
    const client = wrapper(axios.create({ jar }));

    // Get SAML url from max Domain for Authentication
    const url = await client
      .get("https://schema.max.se")
      .then((response) => {
        const $ = cheerio.load(response.data);
        const SAML = $("#loginForm").attr("action");
        const SAML_URL = "https://sts.max.se" + SAML;
        return SAML_URL;
      })
      .catch((err) => {
        errorLog(err);
        return "";
      });

    if (url != "") {
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
          })
          .catch((err) => {
            errorLog(err);
            return;
          });

        const user = await client
          .get("https://web.quinyx.com/extapi/authenticated")
          .then((res) => {
           
            let authenticatedUser = `${res.data.firstname} ${res.data.lastname}`;
            return authenticatedUser;
          })
          .catch((err) => {
            errorLog(err);
            return undefined;
          });

        const group = await client
          .get("https://web.quinyx.com/extapi/v1/organisation/groups?")
          .then((resp) => {
            let group = resp.data
              .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
              .reduce((prev: any, next: any) => prev.concat(next.hasAccess), [])
              .filter((x: any) => x.defaultGroup == true)[0];
            return group;
          })
          .catch((err) => {
            errorLog(err);
            return;
          });

        //TODO Send SESSIONID AS RESPONSE
        //----------------------------------------------------------------------
        let sessionID = jar.toJSON().cookies.filter((cookie) => {
          return cookie.key == "SESSIONID" && cookie.domain == "web.quinyx.com";
        });
        //----------------------------------------------------------------------

        user == undefined
          ? errorLog({ code: 401, message: "User is not authenticated" })
          : messageLog(`Responded Successfully to \x1b[32m${user}\x1b[0m from Restaurang \x1b[33m${group.name}\x1b[0m`);

        res.status(200).send(sessionID);
        return;
      }
    }
  }

  function errorLog(err: { code: any; message: string }) {
    console.debug(`${line}\n[ \x1b[36m${date[0]} - ${date[1]}\x1b[0m ] Error ${err.code ? err.code : ""}:\x1b[31m ${err.message}\x1b[0m`);
  }
  function messageLog(message: string) {
    console.debug(`${line}\n[ \x1b[36m${date[0]} - ${date[1]}\x1b[0m ] ${message}`);
  }
  res.status(400).send("Credentials were not provided");
  return;
}