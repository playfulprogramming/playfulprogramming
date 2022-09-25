import unicornProfilePicMap from "../../public/unicorn-profile-pic-map";

export const getUnicornProfilePicMap = async () => {
	return unicornProfilePicMap;
};

export type ProfilePictureMap = Awaited<
	ReturnType<typeof getUnicornProfilePicMap>
>;
