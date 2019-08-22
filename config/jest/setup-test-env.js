import React from 'react';
import "@testing-library/jest-dom/extend-expect"

jest.mock('gatsby-image', () => {
  return (props) => <img src={props.fixed} className={props.className}/>;
});
