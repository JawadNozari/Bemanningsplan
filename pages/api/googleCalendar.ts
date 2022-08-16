import type { NextApiRequest, NextApiResponse } from "next";
import { calendar } from "@googleapis/calendar";
import { OAuth2Client } from "google-auth-library";

import axios from "axios";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new OAuth2Client(
  clientId,
  clientSecret,
  "http://localhost:3200"
);
const syncCalendar = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.body;

  // const { tokens } = await oauth2Client.getToken(code);
  // res.status(200).json({ response: tokens });

  const events = await axios
    .get("http://localhost:3200/api/mySchema")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  events.map((event: event) => {
    GoogleEventInsert(event);
  });
  res.send("response");
};

const GoogleEventInsert = async (event: event) => {
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const gcalendar = calendar("v3");
 
  const response = await gcalendar.events.insert({
     //@ts-ignore
    auth: oauth2Client,
    calendarId: "primary",
    requestBody: event,
  });
  console.log(response);
  return response;
};
type event = {
  summary: string;
  description: string;
  start: {
    dateTime: Date;
  };
  end: {
    dateTime: Date;
  };
  location: string;
  colorId: string;
};
export default syncCalendar;

// import type { NextApiRequest, NextApiResponse } from "next";
// import { google } from "googleapis";
// import axios from "axios";

// const clientId = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
// const oauth2Client = new google.auth.OAuth2(
//   clientId,
//   clientSecret,
//   "http://localhost:3200"
// );
// const syncCalendar = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { code } = req.body;

//   // const { tokens } = await oauth2Client.getToken(code);
//   // res.status(200).json({ response: tokens });

//   const events = await axios
//     .get("http://localhost:3200/api/mySchema")
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   events.map((event: event) => {
//     GoogleEventInsert(event);
//   });
//   res.send("response");
// };

// const GoogleEventInsert = async (event:event) => {
//   oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//   const calendar = google.calendar("v3");

//   //@ts-ignore
//   const response = await calendar.events.insert({
//     auth: oauth2Client,
//     calendarId: "primary",
//     requestBody: event,
//   });
//   console.log(response);
//   return response;
// };
// type event ={
//   summary:string;
//   description:string;
//   start:{
//     dateTime:Date;
//   }
//   end:{
//     dateTime:Date;
//   }
//   location:string;
//   colorId:string;
// }
// export default syncCalendar;

// const testEvent = {

//   summary: "Eftermiddagschef",
//   description: "",
//   start: {
//     dateTime: "2022-08-12T09:00:00.000Z",
//   },
//   end: {
//     dateTime: "2022-08-13T18:00:00.000Z",
//   },
//   location: "Sköndalsvägen 3, 128 69 Sköndal",
//   colorId: "7",
// };
