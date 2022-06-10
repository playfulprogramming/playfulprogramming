import { wrapAllByQueryWithSuggestion } from "@testing-library/dom/dist/query-helpers";
import { checkContainerType } from "@testing-library/dom/dist/helpers";
import {
  AllByBoundAttribute,
  GetErrorFunction,
  queryAllByAttribute,
  buildQueries,
  Matcher,
  MatcherOptions,
} from "@testing-library/dom";

const queryAllByRel: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0]);
  return queryAllByAttribute("rel", ...args);
};
const getMultipleError: GetErrorFunction<[unknown]> = (c, text) =>
  `Found multiple elements with the rel text of: ${text}`;
const getMissingError: GetErrorFunction<[unknown]> = (c, text) =>
  `Unable to find an element with the rel text of: ${text}`;

const queryAllByRelWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [rel: Matcher, options?: MatcherOptions]
>(queryAllByRel, queryAllByRel.name, "queryAll");

const [queryByRel, getAllByRel, getByRel, findAllByRel, findByRel] =
  buildQueries(queryAllByRel, getMultipleError, getMissingError);

export {
  queryByRel,
  queryAllByRelWithSuggestions as queryAllByRel,
  getByRel,
  getAllByRel,
  findAllByRel,
  findByRel,
};
