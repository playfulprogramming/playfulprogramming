const redEl = document.querySelector("#red");
const blueEl = document.querySelector("#blue");
const greenEl = document.querySelector("#green");

redEl.addEventListener(
	"click",
	() => {
		console.log("A click handled on red using capturing");
		// Setting true here will switch to capture mode
	},
	true,
);

blueEl.addEventListener(
	"click",
	(event) => {
		// Stop the click event from moving further down in the bubble
		event.stopPropagation();
		console.log("A click handled on blue using capturing");
	},
	true,
);

greenEl.addEventListener(
	"click",
	() => {
		console.log("A click handled on green using capturing");
	},
	true,
);
