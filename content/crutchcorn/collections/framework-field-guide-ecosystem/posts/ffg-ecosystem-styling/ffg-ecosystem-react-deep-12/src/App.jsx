// App.jsx
import style from "./App.module.css";

import {Card} from "./Card";

function App() {
	return (
		<ul>
			<li className={style.redCard}>
				<Card title="Red Card" description="Description 1" />
			</li>
			<li className={style.blueCard}>
				<Card title="Blue Card" description="Description 2" />
			</li>
			<li className={style.greenCard}>
				<Card title="Green Card" description="Description 3" />
			</li>
		</ul>
	);
}

export default App;
