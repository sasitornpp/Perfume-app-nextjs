import { suggestedPerfume, Filters } from "./perfume";

export interface Profile {
	id: string;
	name: string | null;
	bio: string | null;
	gender: string;
	images: string | null;
	suggestions_perfumes: suggestedPerfume[] | null;
    likes: string[];
	created_at: Date;
    updated_at: Date;
}

export interface fetch_user_result {
	profile: any;
	albums: any;
	baskets: any;
	perfumes: any;
}

export interface ProfileSettingsProps extends Profile {
	newImageFile?: File | null;
}
