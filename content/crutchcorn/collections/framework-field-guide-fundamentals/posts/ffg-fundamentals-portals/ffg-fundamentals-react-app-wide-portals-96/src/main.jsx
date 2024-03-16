import { createRoot } from "react-dom/client";
import { useState, createContext, useContext } from "react";
import { createPortal } from "react-dom";

const PortalContext = createContext();

function ChildComponent() {
	const portalRef = useContext(PortalContext);
	if (!portalRef) return null;
	return createPortal(<div>Hello, world!</div>, portalRef);
}

function App() {
	const [portalRef, setPortalRef] = useState(null);

	return (
		<PortalContext.Provider value={portalRef}>
			<div
				ref={(el) => setPortalRef(el)}
				style={{ height: "100px", width: "100px", border: "2px solid black" }}
			>
				<div />
			</div>
			<ChildComponent />
		</PortalContext.Provider>
	);
}

createRoot(document.getElementById("root")).render(<App />);
