import { PronounInfo } from "./PronounInfo";
import { RolesEnum } from "./RolesInfo";

export interface RawUnicornInfo {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  description: string;
  socials: {
    twitter?: string;
    github?: string;
    website?: string;
    linkedIn?: string;
    twitch?: string;
    dribbble?: string;
  };
  pronouns: string;
  profileImg: string;
  color: string;
  roles: Array<RolesEnum['id']>;
}

export interface UnicornInfo extends RawUnicornInfo {
  rolesMeta: RolesEnum[];
  pronounsMeta: PronounInfo;
  profileImgMeta: {
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
