/**
 * Delete this when this PR is merged:
 * https://github.com/JaeYeopHan/gatsby-remark-images-medium-zoom/pull/7
 */
// @see https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-images/src/constants.js#L1
const imageClass = '.gatsby-resp-image-image'

const FIRST_CONTENTFUL_PAINT = 'first-contentful-paint'

function onFCP(callback) {
  if (!window.performance) {
    return
  }

  const po = new PerformanceObserver(list =>
    list
      .getEntries()
      .filter(({ entryType }) => entryType === 'paint')
      .map(({ name }) => name === FIRST_CONTENTFUL_PAINT)
      .forEach(callback),
  )

  try {
    po.observe({ entryTypes: ['measure', 'paint'] })
  } catch (e) {
    console.error(e)
    po.disconnect()
  }
}

function applyTabIndex() {
  Array.from(document.querySelectorAll(imageClass)).forEach(
    el => {
      el.setAttribute('tabIndex', 0)
      el.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          el.click();
        }
      })
      return el
    }
  )
}

export const onRouteUpdate = (_) => {
  onFCP(() => applyTabIndex())
}
