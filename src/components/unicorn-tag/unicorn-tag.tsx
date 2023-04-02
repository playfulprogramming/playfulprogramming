import { TagLink } from "components/base";
import { Picture } from "components/base/image/picture";
import { UnicornInfo } from "types/UnicornInfo";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";

type UnicornTagProps = {
	unicorn: Pick<UnicornInfo, "id" | "name">;
	unicornProfilePicMap: ProfilePictureMap;
};

export function UnicornTag({ unicorn, unicornProfilePicMap }: UnicornTagProps) {
	return (
		<TagLink href={`/unicorns/${unicorn.id}`}>
			<Picture
				picture={unicornProfilePicMap.find((u) => u.id === unicorn.id)}
				alt={unicorn.name}
				class="circleImg"
				imgAttrs={{ width: 24, height: 24 }}
			/>
			{unicorn.name}
		</TagLink>
	);
}
