import { Node } from "hast";

interface KeepContent {
	children: Node[];
}

export default function keepContent({ children }: KeepContent) {
	return <>{children}</>;
}
