import { Select, Item } from "../../../components/select/select";

export function ArticleRevisionDropdown() {
	return (
		<div>
			{/* <!-- <p class="text-style-button-regular">{publishedStr}</p> --> */}
			<Select defaultValue="one" prefixSelected="test: ">
				<Item key={"one"}>One</Item>
				<Item key={"two"}>Two</Item>
				<Item key={"three"}>Three</Item>
			</Select>
		</div>
	);
}
