import dayjs from "dayjs";

const displayedDate = dayjs().format("DD/MM/YYYY");

document.getElementById("root").innerText = displayedDate;
