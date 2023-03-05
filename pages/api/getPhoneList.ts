import { NextApiRequest, NextApiResponse } from "next";

export default function getPhoneList(req: NextApiRequest, res: NextApiResponse) {
  // use example.json as a mock data source
  const phoneList = require("./example.json");

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(phoneList);
}
