import React from 'react'

jest.mock('disqus-react', () => {
  return {
    DiscussionEmbed: () => <></>
  }
});
