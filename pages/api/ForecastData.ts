import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonPath = path.join(process.cwd(), "Example/timf-Quinyx.json");
  const readJson = await fs.readFile(jsonPath, "utf8");
  const json = JSON.parse(readJson);
  res.setHeader("Content-Type", "application/json");

  const getValues = [json[1].aggregatedDataSets[2].data].map((data: any) => {
    return data;
  });

  const serializedData = getValues[0]
    .map((data: any) => {
      return {
        time: `${data.start.split("T")[1].slice(0, 2)}-${data.end
          .split("T")[1]
          .slice(0, 2)}`,
        value: Math.round(data.value),
      };
    })
    .filter((data: any) => {
      return data.value != 0;
    });
  res.send(serializedData);
}
