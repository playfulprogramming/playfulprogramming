import { TagLink } from "components/index";
import { Picture } from "components/image/picture";
import { UnicornInfo } from "types/UnicornInfo";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import style from "./unicorn-tag.module.scss";

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

export function UnicornTagSmall({ unicorn, unicornProfilePicMap }: UnicornTagProps) {
	return (
		<TagLink href={`/unicorns/${unicorn.id}`} class={style.tagSmall}>
			<Picture
				picture={unicornProfilePicMap.find((u) => u.id === unicorn.id)}
				alt={unicorn.name}
				class="circleImg"
				imgAttrs={{ width: 20, height: 20 }}
			/>
			{unicorn.name}
		</TagLink>
	);
}
