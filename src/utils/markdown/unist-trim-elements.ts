import * as hast from "hast";

export function trimElements(
	elements: hast.ElementContent[],
): hast.ElementContent[] {
	// Trim empty nodes from the start/end of the array
	for (let i = 0; i < elements.length; i++) {
		const child = elements[i];
		if (child === undefined) break;
		if (child.type == "text" && !!child.value.trim()) break;
		if (child.type == "element" && child.tagName != "p") break;
		if ("children" in child && child.children.length) break;

		elements.splice(0, 1);
		i--;
	}

	for (let i = elements.length - 1; i >= 0; i--) {
		const child = elements[i];
		if (child === undefined) break;
		if (child.type == "text" && !!child.value.trim()) break;
		if (child.type == "element" && child.tagName != "p") break;
		if ("children" in child && child.children.length) break;

		elements.splice(elements.length - 1, 1);
		i++;
	}

	return elements;
}
