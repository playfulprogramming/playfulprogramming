import { MockRole } from "./mock-role";
import { UnicornInfo } from "types/index";

export const MockUnicorn: UnicornInfo = {
	name: "Joe",
	firstName: "Joe",
	lastName: "Other",
	id: "joe",
	description: "Exists",
	color: "red",
	roles: [MockRole.id],
	rolesMeta: [MockRole],
	socials: {
		twitter: "twtrusrname",
		github: "ghusrname",
		website: "example.com",
	},
	pronouns: "they/them",
	pronounsMeta: {
		id: "they/them",
		they: "they",
		them: "them",
		their: "their",
		theirs: "theirs",
		themselves: "themselves",
	},
	profileImg:
		"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
	profileImgMeta: {
		relativePath:
			"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
		relativeServerPath:
			"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
		absoluteFSPath:
			"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
		height: 200,
		width: 200,
	},
};

export const MockUnicornTwo: UnicornInfo = {
	name: "Diane",
	firstName: "Diane",
	lastName: "",
	id: "diane",
	description: "Is a human",
	color: "blue",
	roles: [MockRole.id],
	rolesMeta: [MockRole],
	socials: {
		twitter: "twtrusrname2",
		github: "ghusrname2",
		website: "example.com/2",
	},
	pronouns: "they/them",
	pronounsMeta: {
		id: "they/them",
		they: "they",
		them: "them",
		their: "their",
		theirs: "theirs",
		themselves: "themselves",
	},
	profileImg:
		"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
	profileImgMeta: {
		relativePath:
			"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
		relativeServerPath:
			"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
		absoluteFSPath:
			"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
		height: 200,
		width: 200,
	},
};
