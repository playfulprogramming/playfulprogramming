export function enableSmoothScrolling() {
	document.querySelectorAll("a[data-smooth-scroll]").forEach((el) => {
		const target = document.querySelector(el.getAttribute("href")!)!;
		el.addEventListener("click", (e) => {
			e.preventDefault();
			target.scrollIntoView({
				behavior: "smooth",
				block: el.getAttribute("data-smooth-scroll") as ScrollLogicalPosition,
			});
		});
	});
}
