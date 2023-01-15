//TODO This Part shoud done on client side before sending request to API

import qs from "qs";
import axios from "axios";
import cheerio from "cheerio";
import { header } from "./requestHeader";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //------------------- Log Error and Message in cleaner way -----------------------
  const line = "-".repeat(100);
  let date = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ");
  function errorLog(err: { code: any; message: string }) {
    console.debug(`${line}\n[ \x1b[36m${date[0]} - ${date[1]}\x1b[0m ] Error ${err.code ? err.code : ""}:\x1b[31m ${err.message}\x1b[0m`);
  }
  function messageLog(message: string) {
    console.debug(`${line}\n[ \x1b[36m${date[0]} - ${date[1]}\x1b[0m ] ${message}`);
  }
  messageLog(`Recived Request from Username: \x1b[32m${req.body.userName}\x1b[0m Password:  \x1b[32m${req.body.password}\x1b[0m`);
  //--------------------------------------------------------------------------------
  if (req.body.userName == "" || req.body.password == "") {
    res.status(400).send("Credentials were not provided");
    return;
  }

  //------------------- Create Cookie Jar -----------------------
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  let AuthUrl = "";
  let Response = "";
  let RelayState = "";
  const credentials = qs.stringify({
    Kmsi: "true",
    Password: req.body.password,
    AuthMethod: "FormsAuthentication",
    UserName: `${req.body.userName}@max.se`,
  });

  //------------ Get SAML URL from schema.max.se ----------------
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
  //------------ Check if SAML URL is not empty ---------------------
  if (url == "") {
    errorLog({ code: 500, message: "Server connection error" });
    res.status(500).send("Server connection error");
    return;
  }

  //------------ Get SAMLResponse and RelayState -------------------
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

  //------------ Check if SAMLResponse and RelayState is not empty ---------------------
  if (AuthUrl == "" || Response == "" || RelayState == "") {
    errorLog({ code: 500, message: "Wrong username or password" });
    res.status(500).send("Wrong username or password");
    return;
  }

  //------------ Post SAMLResponse and RelayState to AuthUrl---------------------
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

  //------------ Get authenticated persons Name ---------------------
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
  // ------------ Check if authenticated persons Name is not undefined ---------------------
  if (user == undefined) {
    errorLog({ code: 500, message: "User is not a manager" });
    res.status(500).send("User is not a manager ");
    return;
  }

  //------------ Get Restuarants Name ----------------
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

  //------------ Get SESSIONID from Cookie Jar --------------------
  let sessionID = jar.toJSON().cookies.filter((cookie) => {
    return cookie.key == "SESSIONID" && cookie.domain == "web.quinyx.com";
  });

  //------------ Write Restuarants name to console for  ----------------
  user == undefined
    ? errorLog({ code: 401, message: "User is not authenticated" })
    : messageLog(`Responded Successfully to \x1b[32m${user}\x1b[0m from Restaurang \x1b[33m${group.name}\x1b[0m`);

  res.status(200).send(sessionID);
  return;
}
