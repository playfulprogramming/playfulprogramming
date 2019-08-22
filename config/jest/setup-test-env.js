import React from "react"
import "@testing-library/jest-dom/extend-expect"
import {onLinkClick} from 'gatsby';

jest.mock('gatsby-image', () => {
  return (props) => <img src={props.fixed} className={props.className}/>;
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
      />
    }),
    onLinkClick
  }
})

afterEach(() => {
  onLinkClick.mockReset();
})