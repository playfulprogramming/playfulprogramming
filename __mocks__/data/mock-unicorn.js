import { MockRole } from "./mock-role";

export const MockUnicorn = {
	name: "Joe",
	id: "joe",
	description: "Exists",
	color: "red",
	fields: {
		isAuthor: true
	},
	roles: [MockRole],
	socials: {
		twitter: "twtrusrname",
		github: "ghusrname",
		website: "example.com"
	},
	pronouns: {
		they: "they",
		them: "them",
		their: "their",
		theirs: "theirs",
		themselves: "themselves"
	},
	profileImg: {
		childImageSharp: {
			smallPic: {
				fixed:
					"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
			},
			mediumPic: {
				fixed:
					"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
			},
			bigPic: {
				fixed:
					"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
			}
		}
	}
};

export const MockUnicornTwo = {
	name: "Diane",
	id: "diane",
	description: "Is a human",
	color: "blue",
	fields: {
		isAuthor: true
	},
	roles: [MockRole],
	socials: {
		twitter: "twtrusrname2",
		github: "ghusrname2",
		website: "example.com/2"
	},
	pronouns: {
		they: "they",
		them: "them",
		their: "their",
		theirs: "theirs",
		themselves: "themselves"
	},
	profileImg: {
		childImageSharp: {
			smallPic: {
				fixed:
					"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
			},
			mediumPic: {
				fixed:
					"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
			},
			bigPic: {
				fixed:
					"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
			}
		}
	}
};
