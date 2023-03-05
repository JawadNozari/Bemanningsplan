//TODO We need to handle Errors better and send better responses to the client

import qs from "qs";
import axios from "axios";
import { header } from "../../utilities/requestHeader";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import type { NextApiRequest, NextApiResponse } from "next";
import { Logger } from "../../utilities/Logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.body.userName == "" || req.body.password == "") {
    res.status(400).send("Credentials were not provided");
    return;
  }
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

  let url = await client
    .get("https://schema.max.se")
    .then((res) => {
      let html = res.data;
      const regex = /<form.*?id="loginForm".*?action="(.*?)".*?>/;
      const match = html.match(regex);
      if (match) {
        return "https://sts.max.se" + match[1];
      } else {
        Logger(`code 404: \x1b[31m SAML URL not found \x1b[0m`);
        return "";
      }
    })
    .catch((err) => {
      Logger(err);
      res.status(503).send(err);
      return "";
    });

  //------------ Get SAMLResponse and RelayState -------------------
  if (url != "") {
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
      })
      .catch((err) => {
        Logger(err);
        res.status(401).send("Connection to sts.max.se failed");
        return;
      });
    //------------ Check if SAMLResponse and RelayState is not empty ---------------------
    if (Auth_Url == "" || Response_ == "" || Relay_State == "") {
      Logger(`code 401:\x1b[31m Failed to extract SAML response. Possibly Wrong username or password \x1b[0m`);
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
        Logger(err);
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
        Logger(err);
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
        Logger(err);
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
        Logger(err);
        res.status(403).send("User is not allowed to access this group");
        return;
      });

    Logger(`\x1b[33m${group.name}\x1b[0m\nUser: \x1b[36m${user!.name}\x1b[0m with roll \x1b[32m${userRoll1}\x1b[0m`);

    //------------ Get SESSIONID from Cookie Jar --------------------
    let sessionID = jar.toJSON().cookies.filter((cookie) => {
      return cookie.key == "SESSIONID" && cookie.domain == "web.quinyx.com";
    });
    res.status(200).send(sessionID);
    return;
  } else {
   
    return;
  }
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
