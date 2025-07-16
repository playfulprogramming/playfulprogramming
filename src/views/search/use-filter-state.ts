import { useCallback, useMemo } from "preact/hooks";

interface FilterStateParams {
	tags: string[];
	authors: string[];
	setTags(tags: string[]): void;
	setAuthors(authors: string[]): void;
	setFilters?(filters: Pick<FilterStateParams, "tags" | "authors">): void;
}

export interface FilterState extends Required<FilterStateParams> {
	onTagChange(tag: string, selected: boolean): void;
	onAuthorChange(author: string, selected: boolean): void;
}

export function useFilterState(params: FilterStateParams): FilterState {
	const onTagChange = useCallback(
		(id: string, selected: boolean) => {
			if (selected) {
				params.setTags([...params.tags, id]);
			} else {
				params.setTags(params.tags.filter((tag) => tag !== id));
			}
		},
		[params.tags, params.setTags],
	);

	const onAuthorChange = useCallback(
		(id: string, selected: boolean) => {
			if (selected) {
				params.setAuthors([...params.authors, id]);
			} else {
				params.setAuthors(params.authors.filter((author) => author !== id));
			}
		},
		[params.authors, params.setAuthors],
	);

	return useMemo<FilterState>(
		() => ({
			setFilters(filters) {
				params.setTags(filters.tags);
				params.setAuthors(filters.authors);
			},
			...params,
			onTagChange,
			onAuthorChange,
		}),
		[params.setFilters, onTagChange, onAuthorChange],
	);
}
