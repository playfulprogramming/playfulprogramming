import { DateTime } from "luxon";

const root = document.getElementById("root");

const date = DateTime.now()
	.setZone("America/New_York")
	.minus({ weeks: 1 })
	.endOf("day")
	.toISO();

root.innerText = date;
