export * from "./LicenseInfo";
export * from "./CollectionInfo";
export * from "./PostInfo";
export * from "./PronounInfo";
export * from "./RolesInfo";
export * from "./UnicornInfo";

import languages from "../../content/data/languages.json";

export type Languages = keyof typeof languages;
