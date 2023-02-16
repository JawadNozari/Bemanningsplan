import axios from "axios";

export async function getData(sessionID: string, date: formatedDate) {
  const getData = async (url: string) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Cookie: `SESSIONID=${sessionID}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log("Error: ", err);
      return {};
    }
  };

  try {
    const groupResponse = await getData("https://web.quinyx.com/extapi/v1/organisation/groups?");
    const group = groupResponse
      .reduce((prev: string | any[], next: { hasAccess: any }) => prev.concat(next.hasAccess), [])
      .reduce((prev: string | any[], next: { hasAccess: any }) => prev.concat(next.hasAccess), [])
      .find((x: { defaultGroup: boolean }) => x.defaultGroup == true);

    const scheduleURL = `https://web.quinyx.com/extapi/v1/schedule/shifts/by-group/${group.id}?endDate=${date.endDate}T06:00:00&startDate=${date.startDate}T06:00:00`;
    const forecastURL = `https://web.quinyx.com/extapi/v1/forecast-calculation/groups/${group.id}/forecast-data?end=${date.endDate}T05:00:00&start=${date.startDate}T08:00:00&variableIds=395&variableIds=397`;

    const scheduleData = await getData(scheduleURL);
    const forecastData = await getData(forecastURL);

    return { scheduleData, forecastData };
  } catch (error) {
    console.log("Error: ", error);
    return {};
  }
}

type formatedDate = {
  startDate: string;
  endDate: string;
  startHour: string;
  endHour: string;
};
