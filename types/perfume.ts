interface BasePerfume {
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
}

export interface TradablePerfume extends BasePerfume {
  id: string;
  volume: number;
  scentType: string;
  concentration: string;
  price: number;
  images: File[];
  imagePreviews: string[];
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