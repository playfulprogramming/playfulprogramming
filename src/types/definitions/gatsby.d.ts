import * as gatsby from "gatsby"
declare module "gatsby" {
	export const onLinkClick: jest.Mock;
}
