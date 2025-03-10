export interface User {
	id?: string;
	name: string;
	avatar: string;
}

export interface Reply {
	id?: string;
	user_data: User;
	text: string;
	likes: string[];
	created_at: string;
}

export interface Comments {
	id?: string;
	user_data: User;
	text: string;
	likes: string[];
	created_at: string;
	replies: Reply[];
}

interface BasePerfume {
	name: string;
	descriptions?: string;
	images: string[];
	gender?: string;
	brand?: string;
	concentration?: string;
	scent_type?: string;
	price?: number | null;
	volume?: number;
	user_id?: string;
	top_notes?: string[];
	middle_notes?: string[];
	base_notes?: string[];
	facebook?: string;
	line?: string;
	phone_number?: string;
	accords?: string[];
	updated_at?: string;
	created_at?: string;
	perfumer?: string;
	is_tradable: boolean;
	likes: string[];
    user: User | null;
}

export interface Perfume extends BasePerfume {
	id: string;
	comments: Comments[];
	logo: string;
}

export interface PerfumeMostViews extends Perfume {
	views_count: number;
}

export interface suggestedPerfume extends Perfume {
	match_score?: number;
}

export interface FetchPerfumeResult {
	data: Perfume[] | null;
	error: string | null;
}

export interface Filters {
	search_query: string | null;
	brand_filter: string | null;
	page: number;
	gender_filter: string | null;
	accords_filter: string[];
	top_notes_filter: string[];
	middle_notes_filter: string[];
	base_notes_filter: string[];
	items_per_page: number;
}

export const FiltersPerfumeValues: Filters = {
	search_query: null,
	brand_filter: null,
	page: 1,
	gender_filter: null,
	accords_filter: [],
	top_notes_filter: [],
	middle_notes_filter: [],
	base_notes_filter: [],
	items_per_page: 10,
};

export interface PerfumeForInsert extends BasePerfume {
	imagesFiles: File[];
	imagePreviews?: string[];
}

export interface PerfumeForUpdate extends Perfume {
	imagesFiles: File[];
	imagePreviews?: string[];
}

export const PerfumeInitialState: PerfumeForInsert = {
	name: "",
	descriptions: "",
	gender: "",
	brand: "",
	concentration: "",
	scent_type: "",
	price: 0,
	volume: 0,
	images: [],
	top_notes: [],
	middle_notes: [],
	base_notes: [],
	facebook: "",
	line: "",
	phone_number: "",
	imagePreviews: [],
	imagesFiles: [],
	accords: [],
	perfumer: "",
	is_tradable: true,
	likes: [],
	user: null,
};

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

export interface PerfumeUniqueData {
	brand: { name: string; logo: string }[];
	top_notes: string[];
	middle_notes: string[];
	base_notes: string[];
	accords: string[];
	perfumer: string[];
}


export interface Album {
    id?: string;
    user_id?: string;
    title: string;
    descriptions: string;
    private: boolean;
    likes: string[];
    images: string | null;
    created_at: string;
    perfumes_id: string[];
}

export interface AlbumForInsert extends Omit<Album, 'id' | 'created_at'> {
    id?: string;
    imageFile: File | null;
    perfumes: string[];
}

export interface AlbumWithPerfume extends Album {
    perfumes?: Perfume[];
}

export const AlbumInitialState: AlbumForInsert = {
    title: "",
    descriptions: "",
    private: false,
    likes: [],
    images: null,
    imageFile: null,
    perfumes_id: [],
    perfumes: []
};


export interface Basket {
    id: string;
    amount: number;
    user_id: string;
    perfume_id: string;
    created_at: string;
}

export interface BasketWithPerfume extends Basket {
    perfume: Perfume;
}

export interface BasketForInsert extends Omit<Basket, 'id' | 'created_at'> {
    id?: string;
}

export const BasketInitialState: BasketForInsert = {
    amount: 1,
    user_id: '',
    perfume_id: ''
};