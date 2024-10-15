const refreshButton = document.getElementById("new-dog-btn");
const dogImage = document.getElementById("dog-image");
const dogName = document.getElementById("dog-name");

function displayDog() {
  dogImage.src = '';
  dogImage.alt = 'Loading...'; // Show loading text
  
  fetch("https://dog.ceo/api/breeds/image/random")
	.then(response => response.json())
	.then(data => {
  	dogImage.src = data.message
    dogName.innerText = getBreed(data.message);
	})
}

function getBreed(url) {
  const parts = url.split('/');
  const breed = parts[parts.indexOf('breeds') + 1];

  return breed
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

refreshButton.addEventListener('click', displayDog);