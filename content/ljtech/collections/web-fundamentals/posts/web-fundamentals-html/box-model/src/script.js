document.getElementById("styleBtn").addEventListener("click", function () {
	const boxes = [];

	const marginBox = document.getElementById("marginBox");
	const borderBox = document.getElementById("borderBox");
	const paddingBox = document.getElementById("paddingBox");
	const contentBox = document.getElementById("contentBox");

	if (marginBox.classList.contains("box-margin-styled")) {
		marginBox.classList.remove("box-margin-styled");
	} else {
		marginBox.classList.add("box-margin-styled");
	}

	if (borderBox.classList.contains("box-border-styled")) {
		borderBox.classList.remove("box-border-styled");
	} else {
		borderBox.classList.add("box-border-styled");
	}

	if (paddingBox.classList.contains("box-padding-styled")) {
		paddingBox.classList.remove("box-padding-styled");
	} else {
		paddingBox.classList.add("box-padding-styled");
	}

	if (contentBox.classList.contains("box-content-styled")) {
		contentBox.classList.remove("box-content-styled");
	} else {
		contentBox.classList.add("box-content-styled");
	}
});
