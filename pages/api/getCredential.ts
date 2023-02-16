import qs from "qs";
import axios from "axios";
import { header } from "./requestHeader";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ------------------- Log Error and Message in cleaner way -----------------------
  const line = "-".repeat(100);
  let date = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ");
  function errorLog(err: { code: any; message: string }) {
    console.debug(`${line}\n[ \x1b[36m${date[0]} - ${date[1]}\x1b[0m ] Error ${err.code ? err.code : ""}:\x1b[31m ${err.message}\x1b[0m`);
  }
  function messageLog(message: string) {
    console.debug(`${line}\n[ \x1b[35m${date[0]} - ${date[1]}\x1b[0m ] ${message}`);
  }

  if (req.body.userName == "" || req.body.password == "") {
    res.status(400).send("Credentials were not provided");
    return;
  }
  messageLog(`Recived Request from Username: \x1b[32m${req.body.userName}\x1b[0m Password:  \x1b[32m${req.body.password}\x1b[0m`);

  //------------------- Create Cookie Jar -----------------------
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  let Auth_Url = "";
  let Response_ = "";
  let Relay_State = "";
  const credentials = qs.stringify({
    Kmsi: "true",
    Password: req.body.password,
    AuthMethod: "FormsAuthentication",
    UserName: `${req.body.userName}@max.se`,
  });

  //------------ Get SAML URL from schema.max.se ----------------

  let url = await client.get("https://schema.max.se").then((res) => {
    let html = res.data;
    const regex = /<form.*?id="loginForm".*?action="(.*?)".*?>/;
    const match = html.match(regex);
    if (match) {
      return "https://sts.max.se" + match[1];
    } else {
      errorLog({ code: 404, message: "SAML URL not found" });
      return "";
    }
  });

  //------------ Get SAMLResponse and RelayState -------------------
  await client
    .post(url, credentials, {
      headers: header("sts.max.se", "application/x-www-form-urlencoded"),
    })
    .then((response) => {
      const html = response.data;
      const formRegex =
        /<form.*?action="(.*?)".*?>[\s\S]*?<input.*?name="SAMLResponse".*?value="(.*?)".*?>[\s\S]*?<input.*?name="RelayState".*?value="(.*?)".*?>/i;
      const match = html.match(formRegex);
      if (match) {
        const [_, AuthUrl, Response, RelayState] = match;
        // use the extracted values
        Auth_Url = AuthUrl;
        Response_ = Response;
        Relay_State = RelayState;
      }
      return;
    });
  //------------ Check if SAMLResponse and RelayState is not empty ---------------------
  if (Auth_Url == "" || Response_ == "" || Relay_State == "") {
    errorLog({ code: 500, message: "Failed to extract SAML response. Possibly Wrong username or password" });
    res.status(401).send("Wrong username or password");
    return;
  }

  //------------ Post SAMLResponse and RelayState to AuthUrl---------------------
  const samlData = qs.stringify({
    RelayState: Relay_State,
    SAMLResponse: Response_,
  });
  await client
    .post(Auth_Url, samlData, {
      headers: header("app.quinyx.com", "application/x-www-form-urlencoded"),
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      errorLog(err);
      res.status(401).send("Wrong username or password");
      return;
    });

  //------------ Get authenticated persons roll ---------------------

  const user = await client
    .get("https://web.quinyx.com/extapi/authenticated")
    .then((res) => {
      let user = res.data;
      if (!user) {
        return { userId: "", name: "" };
      }
      return { userId: user.id, name: `${user.firstname} ${user.lastname}` };
    })
    .catch((err) => {
      errorLog(err);
      res.status(403).send("User is not a manager");
      return;
    });

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
      res.send("Failed to get group");
      return;
    });
  let link = `https://web.quinyx.com/extapi/v1/employee/by-group/${group.id}?showExpiredAgreements=false`;
  const userRoll1 = await client
    .get(link)
    .then((res) => {
      let staffCategory = res.data.employees.find((x: any) => x.id == user!.userId);
      return category.find((x: any) => staffCategory.staffCategoryId == x.id)?.role;
    })
    .catch((err) => {
      errorLog(err);
      res.status(403).send("User is not allowed to access this group");
      return;
    });

  messageLog(
    `Responded Successfully to Restuarant \x1b[33m${group.name}\x1b[0m with user \x1b[36m${user!.name}\x1b[0m who is a \x1b[32m${userRoll1}\x1b[0m`
  );

  //------------ Get SESSIONID from Cookie Jar --------------------
  let sessionID = jar.toJSON().cookies.filter((cookie) => {
    return cookie.key == "SESSIONID" && cookie.domain == "web.quinyx.com";
  });
  res.status(200).send(sessionID);
  return;
}

let category = [
  { id: 33496, role: "Administratör" },
  { id: 33504, role: "Operativ Chef" },
  { id: 33503, role: "Vice OP-Chef" },
  { id: 33505, role: "Kontorspersonal" },
  { id: 33506, role: "Regionchef" },
  { id: 33502, role: "Distriktschef" },
  { id: 33498, role: "Restaurangchef" },
  { id: 33501, role: "Bitr. Restaurangchef" },
  { id: 33500, role: "Driftledare" },
  { id: 33499, role: "Trainee" },
  { id: 33497, role: "Personal" },
];
