import axios from "axios";
import { Logger } from "../../utilities/Logger";
export async function getData(sessionID: string, date: formatedDate) {
  const fetchData = async (url: string): Promise<any> => {
    try {
      const response = await axios.get(url, {
        headers: {
          Cookie: `SESSIONID=${sessionID}`,
        },
      });
      return response.data;
    } catch (err) {
      return {};
    }
  };

  try {
    const groupResponse = await fetchData("https://web.quinyx.com/extapi/v1/organisation/groups?");
    const group = groupResponse
      .reduce((prev: string | any[], next: { hasAccess: any }) => prev.concat(next.hasAccess), [])
      .reduce((prev: string | any[], next: { hasAccess: any }) => prev.concat(next.hasAccess), [])
      .find((x: { defaultGroup: boolean }) => x.defaultGroup == true);
    const scheduleURL = `https://web.quinyx.com/extapi/v1/schedule/shifts/by-group/${group.id}?endDate=${date.endDate}T06:00:00&startDate=${date.startDate}T06:00:00`;
    const forecastURL = `https://web.quinyx.com/extapi/v1/forecast-calculation/groups/${group.id}/forecast-data?end=${date.endDate}T05:00:00&start=${date.startDate}T08:00:00&variableIds=395&variableIds=397`;

    const results = await Promise.allSettled([fetchData(scheduleURL), fetchData(forecastURL)]);
    const [scheduleData, forecastData] = results.map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        Logger("Error when fetching Data: All promises were not fulfilled");
        return {};
      }
    });

    let daybefore = formatD(getYesterday(new Date(date.startDate), -1));
    let schedules = scheduleData.filter((item: any) => {
      return item.begin.split("T")[0] !== daybefore;
    });

    schedules?.sort((a: any, b: any) => (a.begin > b.begin ? 1 : -1));

    return { schedules, forecastData };
  } catch (error) {
    Logger("Error when finding group");
    return {};
  }
}

type formatedDate = {
  startDate: string;
  startHour: string | undefined;
  endDate: string;
  endHour: string | undefined;
};
function getYesterday(date: Date, days: number) {
  date.setDate(date.getDate() + days);
  return date;
}
function formatD(date: Date) {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}
