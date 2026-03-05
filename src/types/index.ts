export * from "./LicenseInfo";
export * from "./CollectionInfo";
export * from "./PostInfo";
export * from "./RolesInfo";
export * from "./TagInfo";
export * from "./PersonInfo";
import { languages } from "#src/constants/index";

export type Languages = keyof typeof languages;
