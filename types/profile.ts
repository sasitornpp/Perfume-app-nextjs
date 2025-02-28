export interface SuggestionsPerfumes {
	favoriteScent: string;
	customScent: string;
	favoriteBrand: string;
	customBrand: string;
	rating: number;
	topNotes: string;
	customTopNotes: string;
	middleNotes: string;
	customMiddleNotes: string;
	baseNotes: string;
	customBaseNotes: string;
	situation: string[];
	customSituation: string;
}

export interface Profile {
    id: string;
    name: string | null;
    bio: string | null;
    gender: string;
    images: string | null;
    suggestions_perfumes: SuggestionsPerfumes | null;
    my_perfume: string[] | null;
    wishlist: string[] | null;
    basket: string[] | null;
    created_at: Date;
}
