import { LicenseInfo, PronounInfo, RolesEnum, UnicornInfo } from "../types";
import fs from "fs";
import { join } from "path";

export const dataDirectory = join(process.cwd(), "content/data");

export const getDatas = () => {
  const unicornsRaw: Array<
    Omit<UnicornInfo, "roles" | "pronouns"> & {
      roles: string[];
      pronouns: string;
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

  const fullUnicorns: UnicornInfo[] = unicornsRaw.map((unicorn) => ({
    ...unicorn,
    roles: unicorn.roles.map((role) =>
      rolesRaw.find((rRole) => rRole.id === role)
    ),
    pronouns: pronounsRaw.find(
      (proWithNouns) => proWithNouns.id === unicorn.pronouns
    ),
  })) as never[];

  return {
    unicorns: fullUnicorns,
    roles: rolesRaw,
    pronouns: pronounsRaw,
    licenses: licensesRaw,
  };
};
