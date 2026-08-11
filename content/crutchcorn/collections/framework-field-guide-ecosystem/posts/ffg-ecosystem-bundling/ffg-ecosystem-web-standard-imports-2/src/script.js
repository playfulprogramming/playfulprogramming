// script.js
const buttonEl = document.querySelector("#button");
let count = 0;
buttonEl.addEventListener("click", () => {
	count++;
	document.querySelector("#count").textContent = count;
});
