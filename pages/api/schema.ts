import path from "path";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const Quinyxtest = communicator("2022-08-02");
  const jsonPath = path.join(process.cwd(), "Example/Today.json");
  const readJson = await fs.readFile(jsonPath, "utf8");
  const json = JSON.parse(readJson);
  res.setHeader("Content-Type", "application/json");

  type shiftInf = {
    id: number;
    startDate: string;
    endDate: string;
    isBookedByMe: boolean;
    employee: {
      id: number;
      givenName: string;
      familyName: string;
    };
    breaks: string;
    categoryName: string;
  };

  const schedules = json.schedule.map((shift: shiftInf) => {
    const shiftStart = shift.startDate.split(" ")[1].slice(0, -3);
    const shiftEnd = shift.endDate.split(" ")[1].slice(0, -3);
    const categoryName = shift.categoryName.replace("NEO - ", "");
    const responsibility = () => {
      return categoryName == "Drift" ||
        categoryName == "Rengöring" ||
        categoryName == "Öppning" ||
        categoryName == "Stängning"
        ? null
        : categoryName && categoryName == "Serveringsvärd"
        ? "Servering"
        : categoryName;
    };
    if (
      categoryName != "Maxmöte" &&
      categoryName != "[reserved for system use]"
    ) {
      return {
        amount: null,
        receiptNumber: null,
        primaryStaion: null,
        secondaryStation: null,
        responsibility: responsibility(),
        bookedByEmpolyee: shift.isBookedByMe,
        workingHours: `${shiftStart} - ${shiftEnd}`,
        firstName: shift.employee != null ? shift.employee.givenName : null,
        lastName: shift.employee != null ? shift.employee.familyName : null,
        EmpolyeeId: shift.employee != null ? shift.employee.id : shift.id,
        haveScheduledBreak:
          Object.keys(shift.breaks).length != 0 ? true : false,
      };
    }
  });
  res.send(schedules.filter((x: any) => x != null));
  // res.send(Quinyxtest);
}
