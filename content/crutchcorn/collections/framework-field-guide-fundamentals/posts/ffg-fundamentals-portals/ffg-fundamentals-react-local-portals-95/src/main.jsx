import { createRoot } from "react-dom/client";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

function App() {
	const [portalRef, setPortalRef] = useState(null);

	const portal = useMemo(() => {
		if (!portalRef) return null;
		return createPortal(<div>Hello world!</div>, portalRef);
	}, [portalRef]);

	return (
		<>
			<div
				ref={(el) => setPortalRef(el)}
				style={{ height: "100px", width: "100px", border: "2px solid black" }}
			>
				<div />
			</div>
			{portal}
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
