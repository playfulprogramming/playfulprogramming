import { MockRole } from "./mock-role";
import { UnicornInfo } from "../../src/types";

export const MockUnicorn: UnicornInfo = {
  name: "Joe",
  firstName: "Joe",
  lastName: "Other",
  id: "joe",
  description: "Exists",
  color: "red",
  roles: [MockRole as any],
  socials: {
    twitter: "twtrusrname",
    github: "ghusrname",
    website: "example.com",
  },
  pronouns: {
    id: "they/them",
    they: "they",
    them: "them",
    their: "their",
    theirs: "theirs",
    themselves: "themselves",
  },
  profileImg: {
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
  roles: [MockRole] as any[],
  socials: {
    twitter: "twtrusrname2",
    github: "ghusrname2",
    website: "example.com/2",
  },
  pronouns: {
    id: "they/them",
    they: "they",
    them: "them",
    their: "their",
    theirs: "theirs",
    themselves: "themselves",
  },
  profileImg: {
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
