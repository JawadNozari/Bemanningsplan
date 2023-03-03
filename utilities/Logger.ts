export function Logger(message: string) {
  const line = "-".repeat(100);
  let date = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).split(" ");

  console.debug(`${line}\nLog Time: \x1b[35m${date[0]} - ${date[1]}\x1b[0m | ${message}`);
}
