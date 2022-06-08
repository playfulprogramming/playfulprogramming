import { wrapAllByQueryWithSuggestion } from "@testing-library/dom/dist/query-helpers";
import { checkContainerType } from "@testing-library/dom/dist/helpers";
import {
  AllByBoundAttribute,
  GetErrorFunction,
  queryAllByAttribute,
  buildQueries,
} from "@testing-library/dom";

const queryAllByName: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0]);
  return queryAllByAttribute("name", ...args);
};
const getMultipleError: GetErrorFunction<[unknown]> = (c, text) =>
  `Found multiple elements with the name text of: ${text}`;
const getMissingError: GetErrorFunction<[unknown]> = (c, text) =>
  `Unable to find an element with the name text of: ${text}`;

const queryAllByNameWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [name: Matcher, options?: MatcherOptions]
>(queryAllByName, queryAllByName.name, "queryAll");

const [queryByName, getAllByName, getByName, findAllByName, findByName] =
  buildQueries(queryAllByName, getMultipleError, getMissingError);

export {
  queryByName,
  queryAllByNameWithSuggestions as queryAllByName,
  getByName,
  getAllByName,
  findAllByName,
  findByName,
};
