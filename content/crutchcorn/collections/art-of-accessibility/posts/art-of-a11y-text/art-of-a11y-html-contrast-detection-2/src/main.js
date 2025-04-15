// Get the root element
const el = document.querySelector("#root");

// Use CSS to style the page based on the user's preference for contrast
const styles = `
#root {
	  color: #333333;
	  background: #B0B0B0;
}

@media (prefers-contrast: more) {
  #root {
    color: black;
    background: #f0efef;
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Use JS to detect the user's preference for contrast
const mediaQuery = window.matchMedia("(prefers-contrast: more)");

function changeText(matches) {
	if (matches) {
		el.textContent = "The user prefers more contrast";
	} else {
		el.textContent = "The user has not specified a preference for contrast";
	}
}

// To check the initial value:
changeText(mediaQuery.matches);

// To listen for changes:
mediaQuery.addEventListener("change", (e) => {
	changeText(e.matches);
});
