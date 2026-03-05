import { Type } from "typebox";

export const AuthorMetaSchema = Type.Object(
	{
		name: Type.String(),
		description: Type.String({ default: "" }),
		profileImg: Type.Optional(Type.String()),
		socials: Type.Record(Type.String(), Type.String(), { default: {} }),
		roles: Type.Array(Type.String(), { default: [] }),
	},
	{
		additionalProperties: false,
	},
);
