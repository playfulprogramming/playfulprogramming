import React from "react"

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
