import { MockRole } from "./mock-role";
import { UnicornInfo } from "../../src/types";

export const MockUnicorn: UnicornInfo = {
	name: "Joe",
	firstName: "Joe",
	lastName: "Other",
	id: "joe",
	description: "Exists",
	color: "red",
	fields: {
		isAuthor: true,
	},
	roles: [MockRole as any],
	socials: {
		twitter: "twtrusrname",
		github: "ghusrname",
		website: "example.com",
	},
	pronouns: {
		they: "they",
		them: "them",
		their: "their",
		theirs: "theirs",
		themselves: "themselves",
	},
	profileImg: {
		childImageSharp: {
			smallPic: {
				images: {
					fallback: {
						src:
							"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
					},
					sources: [
						{
							srcSet:
								"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
							type: "png",
						},
					],
				},
				width: 272,
				height: 92,
				layout: "fixed",
			},
			mediumPic: {
				images: {
					fallback: {
						src:
							"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
					},
					sources: [
						{
							srcSet:
								"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
							type: "png",
						},
					],
				},
				width: 272,
				height: 92,
				layout: "fixed",
			},
			bigPic: {
				images: {
					fallback: {
						src:
							"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
					},
					sources: [
						{
							srcSet:
								"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
							type: "png",
						},
					],
				},
				width: 272,
				height: 92,
				layout: "fixed",
			},
		},
	},
};

export const MockUnicornTwo: UnicornInfo = {
	name: "Diane",
	firstName: "Diane",
	lastName: "",
	id: "diane",
	description: "Is a human",
	color: "blue",
	fields: {
		isAuthor: true,
	},
	roles: [MockRole] as any[],
	socials: {
		twitter: "twtrusrname2",
		github: "ghusrname2",
		website: "example.com/2",
	},
	pronouns: {
		they: "they",
		them: "them",
		their: "their",
		theirs: "theirs",
		themselves: "themselves",
	},
	profileImg: {
		childImageSharp: {
			smallPic: {
				images: {
					fallback: {
						src:
							"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
					},
					sources: [
						{
							srcSet:
								"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
							type: "png",
						},
					],
				},
				width: 272,
				height: 92,
				layout: "fixed",
			},
			mediumPic: {
				images: {
					fallback: {
						src:
							"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
					},
					sources: [
						{
							srcSet:
								"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
							type: "png",
						},
					],
				},
				width: 272,
				height: 92,
				layout: "fixed",
			},
			bigPic: {
				images: {
					fallback: {
						src:
							"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
					},
					sources: [
						{
							srcSet:
								"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
							type: "png",
						},
					],
				},
				width: 272,
				height: 92,
				layout: "fixed",
			},
		},
	},
};
