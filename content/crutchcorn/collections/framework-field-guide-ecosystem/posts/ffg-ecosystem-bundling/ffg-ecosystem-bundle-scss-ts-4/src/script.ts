// script.ts
const buttonEl = document.querySelector("#button") as HTMLButtonElement;
let count = 0;
buttonEl.addEventListener("click", () => {
	count++;
	document.querySelector("#count")!.textContent = "" + count;
});
