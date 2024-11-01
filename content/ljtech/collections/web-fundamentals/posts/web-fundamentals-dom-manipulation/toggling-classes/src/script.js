const playfulCard = document.getElementById("pfp-card");
const sizeButton = document.getElementById("toggle-size-btn");
const imageButton = document.getElementById("toggle-image-btn");

function toggleSize() {
	playfulCard.classList.toggle("small");
	console.log("Class toggled");
}

function toggleImage() {
	playfulCard.classList.toggle("no-image");
}

sizeButton.addEventListener("click", toggleSize);
imageButton.addEventListener("click", toggleImage);
