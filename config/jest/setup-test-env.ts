import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import "../../__mocks__/modules";

const originConsoleErr = console.error;
console.error = (message?: any, ...optionalParams: any[]) => {
	if (/Not implemented: navigation/.exec(message)) return;
	originConsoleErr(message, ...optionalParams);
};
