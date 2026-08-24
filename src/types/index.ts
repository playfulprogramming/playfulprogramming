export * from "./LicenseInfo.ts";
export * from "./CollectionInfo.ts";
export * from "./PostInfo.ts";
export * from "./RolesInfo.ts";
export * from "./TagInfo.ts";
export * from "./PersonInfo.ts";
import type { languages } from "#src/constants/index.ts";

export type Languages = keyof typeof languages;
