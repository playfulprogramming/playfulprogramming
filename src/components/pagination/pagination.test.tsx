import * as React from 'preact';
import { render } from "@testing-library/preact";
import { Pagination } from './pagination';

test("Pagination renders", async () => {
	const { baseElement, findByText } = render(
		<Pagination
			page={{
				currentPage: 3,
				lastPage: 8,
			}}
		/>
	);

	expect(baseElement).toBeInTheDocument();
	expect(await findByText("3")).toBeInTheDocument();
});
