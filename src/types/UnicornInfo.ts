import { PronounInfo } from "./PronounInfo";
import { RolesEnum } from "./RolesInfo";

export interface UnicornInfo {
  name: string;
  firstName: string;
  lastName: string;
  id: string;
  description: string;
  color: string;
  roles: RolesEnum[];
  socials: {
    twitter?: string;
    github?: string;
    website?: string;
    linkedIn?: string;
    twitch?: string;
    dribbble?: string;
  };
  pronouns: PronounInfo;
  profileImg: {
    // Relative to "public/unicorns"
    relativePath: string;
    // Relative to site root
    relativeServerPath: string;
    // This is not stored, it's generated at build time
    absoluteFSPath: string;
    height: number;
    width: number;
  };
}
