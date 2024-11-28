import { DateTime } from "https://unpkg.com/luxon@3.5.0/build/es6/luxon.js";

const root = document.getElementById("root");

const date = DateTime.now()
	.setZone("America/New_York")
	.minus({ weeks: 1 })
	.endOf("day")
	.toISO();

root.innerText = date;
