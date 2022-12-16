import axios from "axios";
import { calendar } from "@googleapis/calendar";
import { OAuth2Client } from "google-auth-library";
import type { NextApiRequest, NextApiResponse } from "next";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new OAuth2Client(clientId, clientSecret, "http://localhost:3200");
const syncCalendar = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.body;

  const { tokens } = await oauth2Client.getToken(code);

  const { refresh_token } = tokens;

  const events = await axios
    .get("http://localhost:3200/api/mySchema") //TODO This API is Disabled. we need to create a new API for this part
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
  events.map((event: event) => {
    GoogleEventInsert(event, refresh_token);
  });
  res.send("response");
};

const GoogleEventInsert = async (event: event, refresh_tokens: any) => {
  oauth2Client.setCredentials({ refresh_token: refresh_tokens });
  const gcalendar = calendar("v3");

  const response = await gcalendar.events.insert({
    //@ts-ignore
    auth: oauth2Client,
    calendarId: "primary",
    requestBody: event,
  });

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
