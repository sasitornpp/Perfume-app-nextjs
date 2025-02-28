export interface BasePerfume {
	name: string;
	brand: string;
	gender: string;
	accords: string[];
	descriptions: string;
	perfumer: string;
	topNotes: string[];
	middleNotes: string[];
	baseNotes: string[];
	rating: number;
	totalVotes: number;
}

export interface Perfume extends BasePerfume {
	id: string;
	images: string[];
	logo: string;
}

export interface FetchPerfumeResult {
	data: Perfume[] | null;
	error: string | null;
}

export interface Filters {
	searchQuery?: string;
	brand?: string;
	page: number;
	gender?: string;
	accords?: string[];
	top_notes?: string[];
	middle_notes?: string[];
	base_notes?: string[];
}

export const FiltersPerfumeValues = {
	searchQuery: "",
	brand: "",
	page: 1,
	gender: "",
	accords: [],
	top_notes: [],
	middle_notes: [],
	base_notes: [],
};

export interface TradablePerfume {
    id: string;
    name: string;
    descriptions: string;
    gender: string | null;
    brand: string | null;
    concentration: string | null;
    scentType: string | null;
    price: number;
    volume: number;
    userId: string;
    userName: string;
    images: string[];
    imagesFiles: File[];
    topNotes: string[] | null;
    middleNotes: string[] | null;
    baseNotes: string[] | null;
    facebook: string | null;
    line: string | null;
    phoneNumber: string | null;
    imagePreviews?: [],
    accords: [""],
    perfumer: string | null;
    rating?: number;
    totalVotes?: number;
}

export type SituationType = "daily" | "formal" | "date" | "party" | "exercise";

export const situation: Record<SituationType, string[]> = {
	daily: [
		"Woody",
		"Powdery",
		"Fresh Spicy",
		"Soft Spicy",
		"Sweet",
		"Vanilla",
		"Citrus",
		"Herbal",
		"Ozonic",
		"Green",
		"Lactonic",
		"Yellow Floral",
		"Coconut",
		"Fruity",
		"Nutty",
		"Almond",
		"Coffee",
		"Aromatic",
		"Lavender",
		"Floral",
		"Violet",
		"Iris",
		"White Floral",
		"Fresh",
		"Tuberose",
		"Soapy",
		"Aldehydic",
		"Mossy",
		"Marine",
		"Salty",
		"Aquatic",
	],
	formal: [
		"Oud",
		"Woody",
		"Amber",
		"Rose",
		"Powdery",
		"Patchouli",
		"Warm Spicy",
		"Balsamic",
		"Leather",
		"Smoky",
		"Tobacco",
		"Musky",
		"Soft Spicy",
		"Animalic",
		"Herbal",
		"Coffee",
		"Green",
		"Beeswax",
		"Lactonic",
		"Yellow Floral",
		"Aromatic",
		"Lavender",
		"Floral",
		"Earthy",
		"Violet",
		"Iris",
		"White Floral	",
		"Honey",
		"Tuberose",
		"Cinnamon",
		"Anis",
		"Soapy",
		"Aldehydic",
		"Whiskey",
		"Mossy",
		"Metallic",
	],
	date: [
		"Rose",
		"Amber",
		"Vanilla",
		"Powdery",
		"Musky",
		"Caramel",
		"Yellow Floral",
		"Coconut",
		"Fruity",
		"Almond",
		"Coffee",
		"Sweet",
		"Oud",
		"Woody",
		"Warm Spicy",
		"Soft Spicy",
		"Animalic",
		"Beeswax",
		"Lactonic",
		"Nutty",
		"Herbal",
		"Cacao",
		"Aromatic",
		"Lavender",
		"Floral",
		"Earthy",
		"Violet",
		"Iris",
		"White Floral	",
		"Honey",
		"Tuberose",
		"Cinnamon",
		"Anis",
	],
	party: [
		"Oud",
		"Woody",
		"Amber",
		"Patchouli",
		"Warm Spicy",
		"Balsamic",
		"Leather",
		"Smoky",
		"Tobacco",
		"Musky",
		"Sweet",
		"Vanilla",
		"Fresh Spicy",
		"Soft Spicy",
		"Animalic",
		"Coconut",
		"Fruity",
		"Nutty",
		"Almond",
		"Coffee",
		"Sour",
		"Cinnamon",
		"Anis",
		"Whiskey",
		"Honey",
		"Cacao",
	],
	exercise: [
		"Citrus",
		"Fresh Spicy",
		"Ozonic",
		"Lactonic",
		"Nutty",
		"Sour",
		"Aromatic",
		"Lavender",
		"Fresh",
		"Soapy",
		"Marine",
		"Salty",
		"Aquatic",
	],
};

