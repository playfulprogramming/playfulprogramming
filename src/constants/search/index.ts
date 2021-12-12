import Index from "flexsearch/src/index";

import { encode } from "flexsearch/src/lang/latin/advanced";
import { stemmer, filter, matcher } from "flexsearch/src/lang/en";

export const getNewIndex = () => {
  return new Index({
    resolution: 3,
    minlength: 3,
    fastupdate: false,
    stemmer,
    filter,
    matcher,
    encode,
    optimize: true,
    tokenize: "forward",
  });
};
