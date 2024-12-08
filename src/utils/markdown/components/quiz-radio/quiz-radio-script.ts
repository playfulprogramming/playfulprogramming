function createPWithMessage(msg: string) {
	const el = document.createElement("p");
	el.innerText = msg;
	return el;
}

function waitRandomTimeAndPossiblyFail() {
	return new Promise<void>((resolve, reject) => {
		setTimeout(
			() => {
				if (Math.random() <= 0.3) {
					reject();
				} else {
					resolve();
				}
			},
			Math.floor(Math.random() * 1000),
		);
	});
}

function disableQuizRadio(quizRadioForm: HTMLFormElement) {
	quizRadioForm.disabled = true;
	Array.from(quizRadioForm.elements).forEach(
		(el) => ((el as HTMLInputElement).disabled = true),
	);
}

function quizRadioFormBehavior(quizRadioForm: HTMLFormElement) {
	const quizRadioButton = quizRadioForm.querySelector(
		"button",
	) as HTMLButtonElement;

	const messageSection = quizRadioForm.querySelector(
		"[data-message-section]",
	) as HTMLDivElement;

	quizRadioForm.addEventListener("submit", (e) => {
		e.preventDefault();
		disableQuizRadio(quizRadioForm);
		messageSection.replaceChildren(createPWithMessage("Loading..."));
		waitRandomTimeAndPossiblyFail()
			.then(() => {
				messageSection.replaceChildren(createPWithMessage("Success"));
			})
			.catch((err) => {
				messageSection.replaceChildren(
					createPWithMessage("An error occurred..."),
				);
			});
	});

	function checkValid() {
		if (quizRadioForm.checkValidity()) {
			quizRadioButton.disabled = false;
		} else {
			quizRadioButton.disabled = true;
		}
	}

	quizRadioForm.addEventListener("input", () => checkValid());

	quizRadioForm.addEventListener("reset", () => {
		// Allow the form time to recalculate validity
		setTimeout(checkValid, 0);
	});
}

export function enableQuizRadios() {
	const quizRadios = Array.from(
		document.querySelectorAll("[data-quiz-radio]"),
	) as HTMLFormElement[];
	for (const quizRadioForm of quizRadios) {
		quizRadioFormBehavior(quizRadioForm);
	}
}
