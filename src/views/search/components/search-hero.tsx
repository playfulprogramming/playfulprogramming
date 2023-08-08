import { PropsWithChildren } from "preact/compat";
import { JSXNode } from "components/types";

interface SearchHeroProps {
	title: string;
	description: string;
	buttons?: JSXNode;
}

export const SearchHero = ({
	title,
	description,
	buttons,
}: SearchHeroProps) => {
	return (
		<>
			<h2>{title}</h2>
			<p>{description}</p>
			{buttons}
		</>
	);
};
