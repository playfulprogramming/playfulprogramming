import React from "react"
import "@testing-library/jest-dom/extend-expect"
import {onLinkClick} from 'gatsby';

jest.mock('gatsby-image', () => {
  return (props) => {
    return <img
      src={props.fixed}
      alt={props.alt}
      data-testid={props['data-testid']}
      className={props.className}
    />;
  }
});

jest.mock('gatsby', () => {
  const react = require('react');
  const gatsbyOGl = jest.requireActual('gatsby');
  const onLinkClick = jest.fn();

  return {
    ...gatsbyOGl,
    Link: react.forwardRef((props, ref) => {
      return <a onClick={onLinkClick}
         style={props.style}
         ref={ref}
         className={props.className}
      >
        {props.children}
      </a>
    }),
    onLinkClick
  }
})

afterEach(() => {
  onLinkClick.mockReset();
})