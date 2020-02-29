import * as gatsby from "gatsby-plugin-google-analytics"
declare module "gatsby-plugin-google-analytics" {
	export const onLinkClick: jest.Mock;
}
