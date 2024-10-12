const paragraphForm = document.getElementById("p-form");
const submitButton = document.getElementById("p-submit");
const removeButton = document.getElementById("p-remove");

const addParagraph = () => {
	let newParagraphText = paragraphForm.value;

	let newParagraph = document.createElement('p');
	newParagraph.textContent = newParagraphText;

	document.body.appendChild(newParagraph);
}

const removeAllParagraphs = () => {
	const paragraphs = document.querySelectorAll('p');
	paragraphs.forEach(paragraph => paragraph.remove()); 
}

submitButton.addEventListener('click', addParagraph);
removeButton.addEventListener('click', removeAllParagraphs);

