import { createRoot } from "react-dom/client";
import { useRef } from "react";

const messages = [
	"The new slides for the design keynote look wonderful!",
	"Some great new colours are planned to debut with Material Next!",
	"Hey everyone! Please take a look at the resources I’ve attached.",
	"So on Friday we were thinking about going through that park you’ve recommended.",
	"We will discuss our upcoming Pixel 6 strategy in the following week.",
	"On Thursday we drew some great new ideas for our talk.",
	"So the design teams got together and decided everything should be made of sand.",
];

function App() {
	const messagesRef = useRef([]);

	const scrollToTop = () => {
		messagesRef.current[0].scrollIntoView();
	};

	const scrollToBottom = () => {
		messagesRef.current[messagesRef.current.length - 1].scrollIntoView();
	};

	return (
		<div>
			<button onClick={scrollToTop}>Scroll to top</button>
			<ul style={{ height: "50px", overflow: "scroll" }}>
				{messages.map((message, i) => {
					return (
						<li key={message} ref={(el) => (messagesRef.current[i] = el)}>
							{message}
						</li>
					);
				})}
			</ul>
			<button onClick={scrollToBottom}>Scroll to bottom</button>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
