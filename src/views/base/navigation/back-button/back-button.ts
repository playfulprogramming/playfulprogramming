export const backButtonListener = () => {
	const backBtn = document.querySelector("#backbtn");

	if (!backBtn) return;

	let hasHistory = false;
	window.addEventListener("beforeunload", () => {
		hasHistory = true;
	});

	backBtn.addEventListener("click", () => {
		if (!document.referrer) {
			// This is the first page the user has visited on the site in this session
			window.location.href = "/";
			return;
		}
		history.back();

		// User cannot go back, meaning that we're at the first page of the site session
		setTimeout(() => {
			if (!hasHistory) {
				window.location.href = "/";
			}
		}, 200);
	});
};
