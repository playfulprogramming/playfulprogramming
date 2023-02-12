import { getUnicornProfilePicMap } from "utils/get-unicorn-profile-pic-map";

export const get = async () => {
	const unicornProfilePicMap = await getUnicornProfilePicMap();
	return { body: JSON.stringify(unicornProfilePicMap) };
};
