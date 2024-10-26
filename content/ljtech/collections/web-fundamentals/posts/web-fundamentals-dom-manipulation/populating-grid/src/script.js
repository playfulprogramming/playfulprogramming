const refreshButton = document.getElementById("refresh-btn");
const dogGrid = document.getElementById("dog-grid");

async function fetchDogs() {
	dogGrid.innerHTML = ""; // Clear the dog grid

	const requests = [];

	// Loop to fetch 8 random dog images
	for (let i = 0; i < 8; i++) {
		const request = fetch("https://dog.ceo/api/breeds/image/random");
		requests.push(request); // Add fetch promise to the array
	}

	try {
		const responses = await Promise.all(requests); // Wait for all requests to complete

		const results = await Promise.all(responses.map((res) => res.json())); // Parse each response as JSON

		results.forEach((data) => {
			const dogCard = document.createElement("div");
			dogCard.className = "dog-card";

			const dogImage = document.createElement("img");
			dogImage.src = data.message;
			dogImage.alt = "Dog Image";

			const dogName = document.createElement("h3");
			dogName.innerText = getBreed(data.message); // Extract breed from image URL

			dogCard.appendChild(dogImage);
			dogCard.appendChild(dogName);
			dogGrid.appendChild(dogCard);
		});
	} catch (error) {
		console.error("Error:", error); // Handle any errors in fetching data
	}
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
