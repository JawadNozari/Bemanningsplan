export function formatDate(dateString: Date) {
  const date = dateString ? new Date(dateString) : new Date();
  return {
    startDate: formatD(date),
    endDate: formatD(addDays(date, 1)),
    startHour: formatTime(date),
    endHour: formatTime(addDays(date, 1)),
  };

  function addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
  }
  function formatTime(date: Date) {
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    return `${hours}:${minutes}`;
  }

  function formatD(date: Date) {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }
}
