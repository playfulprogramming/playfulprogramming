import { wrapAllByQueryWithSuggestion } from "@testing-library/dom/dist/query-helpers";
import { checkContainerType } from "@testing-library/dom/dist/helpers";
import {
  AllByBoundAttribute,
  GetErrorFunction,
  queryAllByAttribute,
  buildQueries,
} from "@testing-library/dom";

const queryAllByProperty: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0]);
  return queryAllByAttribute("property", ...args);
};
const getMultipleError: GetErrorFunction<[unknown]> = (c, text) =>
  `Found multiple elements with the property text of: ${text}`;
const getMissingError: GetErrorFunction<[unknown]> = (c, text) =>
  `Unable to find an element with the property text of: ${text}`;

const queryAllByPropertyWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [property: Matcher, options?: MatcherOptions]
>(queryAllByProperty, queryAllByProperty.name, "queryAll");

const [
  queryByProperty,
  getAllByProperty,
  getByProperty,
  findAllByProperty,
  findByProperty,
] = buildQueries(queryAllByProperty, getMultipleError, getMissingError);

export {
  queryByProperty,
  queryAllByPropertyWithSuggestions as queryAllByProperty,
  getByProperty,
  getAllByProperty,
  findAllByProperty,
  findByProperty,
};
