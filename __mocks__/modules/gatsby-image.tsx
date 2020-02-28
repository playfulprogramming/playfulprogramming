import React from "react";

jest.mock("gatsby-image", () => {
	return (props: any) => {
		return (
			<img
				src={props.fixed}
				alt={props.alt}
				data-testid={props["data-testid"]}
				className={props.className}
			/>
		);
	};
});
