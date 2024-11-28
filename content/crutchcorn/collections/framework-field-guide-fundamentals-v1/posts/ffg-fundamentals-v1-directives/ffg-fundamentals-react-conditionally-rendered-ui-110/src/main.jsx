import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

const flags = {
	addToCartButton: true,
	purchaseThisItemButton: false,
};

const useFeatureFlag = ({
	flag,
	enabledComponent,
	disabledComponent = null,
}) => {
	if (flags[flag]) {
		return { comp: enabledComponent };
	}
	return {
		comp: disabledComponent,
	};
};

function App() {
	const { comp: addToCartComp } = useFeatureFlag({
		flag: "addToCartButton",
		enabledComponent: <button>Add to cart</button>,
	});

	const { comp: purchaseComp } = useFeatureFlag({
		flag: "purchaseThisItemButton",
		enabledComponent: <button>Purchase this item</button>,
	});

	return (
		<div>
			{addToCartComp}
			{purchaseComp}
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
