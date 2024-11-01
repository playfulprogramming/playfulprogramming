const redEl = document.querySelector("#red");
const blueEl = document.querySelector("#blue");
const greenEl = document.querySelector("#green");

redEl.addEventListener(
	"click",
	() => {
		console.log("A click handled on red using bubbling");
		// This is set to false in order to use bubbling. We'll cover the `true` case later on
	},
	false,
);

blueEl.addEventListener(
	"click",
	(event) => {
		// Stop the click event from moving further up in the bubble
		event.stopPropagation();
		console.log("A click handled on blue using bubbling");
	},
	false,
);

greenEl.addEventListener(
	"click",
	() => {
		console.log("A click handled on green using bubbling");
	},
	false,
);
