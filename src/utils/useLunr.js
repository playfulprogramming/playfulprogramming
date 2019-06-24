import React, {useState} from "react"


function getSearchResults(query, lng) {
  if (!query || !window.__LUNR__) return []
  const lunrIndex = window.__LUNR__[lng]
  // you can customize your search, see https://lunrjs.com/guides/searching.html
  const results = lunrIndex.index.search(query)
  return results.map(({ ref }) => lunrIndex.store[ref])
}

/**
 *
 * @param [language]
 * @returns {object}
 * results - an array of matches {slug: string}[]
 * onSearch - A `onChange` event or a callback to pass a string
 */
export const useLunr = ({language = 'en'} = {}) => {
  const [_, setQuery] = useState("")
  const [results, setResults] = useState(null)

  const onSearch = eventOrStr => {
    console.log('onSearch is called', eventOrStr)
    const eventVal = typeof eventOrStr === 'string' ? eventOrStr : eventOrStr.target.value
    if (!eventVal) {
      setResults(null)
      setQuery('');
      return;
    }
    const results = getSearchResults(eventVal, language)
    setQuery(eventVal)
    setResults(results)
  }

  return {onSearch, results};
}
