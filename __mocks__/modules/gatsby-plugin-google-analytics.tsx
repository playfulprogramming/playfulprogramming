import React from 'react'
import {onLinkClick} from 'gatsby-plugin-google-analytics';

afterEach(() => {
  onLinkClick.mockReset();
})

jest.mock('gatsby-plugin-google-analytics', () => {
  const onLinkClick = jest.fn();

  return {
    OutboundLink: (props) => <div onClick={onLinkClick}>{props.children}</div>,
    onLinkClick
  }
});
