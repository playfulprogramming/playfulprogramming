import { LicenseInfo, PronounInfo, RolesEnum, UnicornInfo } from "types/index";
import * as fs from "fs";
import { join } from "path";
import { getImageSize } from "rehype-img-size";
import { getFullRelativePath } from "./url-paths";

export const postsDirectory = join(process.cwd(), "content/blog");
export const collectionsDirectory = join(process.cwd(), "content/collections");
export const dataDirectory = join(process.cwd(), "content/data");
export const siteDirectory = join(process.cwd(), "content/site");
export const sponsorsDirectory = join(process.cwd(), "public/sponsors");

const unicornsRaw: Array<
  Omit<UnicornInfo, "roles" | "pronouns" | "profileImg"> & {
    roles: string[];
    pronouns: string;
    profileImg: string;
  }
> = JSON.parse(
  fs.readFileSync(join(dataDirectory, "unicorns.json")).toString()
);

const rolesRaw: RolesEnum[] = JSON.parse(
  fs.readFileSync(join(dataDirectory, "roles.json")).toString()
);

const pronounsRaw: PronounInfo[] = JSON.parse(
  fs.readFileSync(join(dataDirectory, "pronouns.json")).toString()
);

const licensesRaw: LicenseInfo[] = JSON.parse(
  fs.readFileSync(join(dataDirectory, "licenses.json")).toString()
);

const fullUnicorns: UnicornInfo[] = unicornsRaw.map((unicorn) => {
  const absoluteFSPath = join(dataDirectory, unicorn.profileImg);
  const relativeServerPath = getFullRelativePath(
    "/unicorns",
    unicorn.profileImg
  );
  const profileImgSize = getImageSize(absoluteFSPath);

  // Mutation go BRR
  const newUnicorn: UnicornInfo = unicorn as never;

  newUnicorn.profileImgMeta = {
    height: profileImgSize.height as number,
    width: profileImgSize.width as number,
    relativePath: unicorn.profileImg,
    relativeServerPath,
    absoluteFSPath,
  };

  newUnicorn.rolesMeta = unicorn.roles.map(
    (role) => rolesRaw.find((rRole) => rRole.id === role)!
  );

  newUnicorn.pronounsMeta = pronounsRaw.find(
    (proWithNouns) => proWithNouns.id === unicorn.pronouns
  )!;

  return newUnicorn;
});

export {
  fullUnicorns as unicorns,
  rolesRaw as roles,
  pronounsRaw as pronouns,
  licensesRaw as licenses,
};
