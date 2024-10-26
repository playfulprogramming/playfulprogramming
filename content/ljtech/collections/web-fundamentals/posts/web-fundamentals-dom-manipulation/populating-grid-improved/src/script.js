const refreshButton = document.getElementById("refresh-btn");
const dogGrid = document.getElementById("dog-grid");
const maxItems = 8;

function fetchDogs() {
	dogGrid.style.opacity = 0.5; // Fade the cards

	const dogCardArray = [];

	const requests = [];

	for (let i = 0; i < maxItems; i++) {
		const request = fetch("https://dog.ceo/api/breeds/image/random").then(
			(response) => response.json(),
		);
		requests.push(request);
	}

	Promise.all(requests)
		.then((results) => {
			results.forEach((data) => {
				const dogCard = document.createElement("div");
				dogCard.className = "dog-card";

				const dogImage = document.createElement("img");
				dogImage.src = data.message;
				dogImage.alt = "Dog Image";

				const dogName = document.createElement("h3");
				dogName.innerText = getBreed(data.message);
				dogImage.onload = () => {
					dogCard.appendChild(dogImage);
					dogCard.appendChild(dogName);
					dogCardArray.push(dogCard);
					if (dogCardArray.length === maxItems) {
						dogGrid.innerHTML = "";
						dogCardArray.forEach((card) => {
							dogGrid.appendChild(card);
							dogGrid.style.opacity = 1;
						});
					}
				};
			});
		})
		.catch((error) => console.error("Error:", error));
}

function getBreed(url) {
	const parts = url.split("/");
	const breed = parts[parts.indexOf("breeds") + 1];

	return breed
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

refreshButton.addEventListener("click", fetchDogs);
