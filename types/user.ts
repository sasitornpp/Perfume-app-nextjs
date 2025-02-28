import { Perfume } from "./perfume";
import { SuggestionsPerfumes } from "./profile";

export interface Profile {
	id: string;
	name: string;
	bio: string;
	gender: string;
	images: string;
	suggestions_perfumes: SuggestionsPerfumes;
	perfume_id: string[];
	created_at: Date;
}
