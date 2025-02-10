import style from "./article-revisions.module.scss";
import { Select, Item } from "../../../components/select/select";

export function ArticleRevisionDropdown() {
	return (
		<div>
			{/* <!-- <p class="text-style-button-regular">{publishedStr}</p> --> */}
			<Select
				defaultValue="One"
				prefixSelected=""
				testId={"article-revision-selection"}
				class={style.test}
			>
				<Item key={"one"}>One</Item>
				<Item key={"two"}>Two</Item>
				<Item key={"three"}>Three</Item>
			</Select>
		</div>
	);
}
