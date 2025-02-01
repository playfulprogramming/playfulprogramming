import { createRoot } from "react-dom/client";
import {
	ComponentPropsWithoutRef,
	ElementType,
	PropsWithChildren,
} from "react";

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
	ComponentPropsWithoutRef<E> & {
		as?: E;
	}
>;

type HeaderProps<T extends ElementType = "h1"> = PolymorphicProps<T> & {
	as?: T;
};

function Header<const T extends ElementType = "h1">({
	as,
	children,
	...props
}: HeaderProps<T>) {
	const Heading = as || "h1";
	return (
		<Heading {...props} style={{ color: "darkred" }}>
			{children}
		</Heading>
	);
}

const App = () => {
	return (
		<Header as="h1" id={"test"}>
			Hello, world!
		</Header>
	);
};

createRoot(document.getElementById("root")!).render(<App />);
