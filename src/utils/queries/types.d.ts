declare module "@testing-library/dom/dist/query-helpers" {
  import { Variant, WithSuggest } from "@testing-library/dom";
  declare const wrapAllByQueryWithSuggestion: <
    Arguments extends [...unknown[], WithSuggest]
  >(
    query: (container: HTMLElement, ...args: Arguments) => HTMLElement[],
    queryAllByName: string,
    variant: Variant
  ) => (container: HTMLElement, ...args: Arguments) => HTMLElement[];

  export { wrapAllByQueryWithSuggestion };
}

declare module "@testing-library/dom/dist/helpers" {
  declare const checkContainerType: (...props: any[]) => any;
  export { checkContainerType };
}
