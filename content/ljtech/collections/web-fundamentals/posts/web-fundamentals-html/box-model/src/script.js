const boxModelContainer = document.getElementById("box-model-container");
const toggleButton = document.getElementById("toggle-button");

toggleButton.addEventListener("click", (e) => {
	const isActive = boxModelContainer.toggleAttribute("data-box-model-active");
	e.target.ariaPressed = String(isActive);
});
