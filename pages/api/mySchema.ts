import path from "path";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const Quinyxtest = communicator("2022-08-02");
  const jsonPath = path.join(process.cwd(), "Example/myShift.json");
  const readJson = await fs.readFile(jsonPath, "utf8");
  const json = JSON.parse(readJson);
  res.setHeader("Content-Type", "application/json");

  const schedules = json.schedule.map((shift: shiftInf) => {
    const startDate = new Date(shift.startDate);
    const endDate = new Date(shift.endDate);
    return {
      summary: shift.categoryName.replace("NEO - ", ""),
      description: shift.description,
      start: { dateTime: startDate },
      end: { dateTime: endDate },
      location: "Sköndalsvägen 3, 128 69 Sköndal",
      colorId: "7",
    };
  });
  res.json(schedules);
}

type shiftInf = {
  id: number;
  startDate: string;
  endDate: string;
  description: string;
  isBookedByMe: boolean;
  employee: {
    id: number;
    givenName: string;
    familyName: string;
  };
  breaks: string;
  categoryName: string;
};
