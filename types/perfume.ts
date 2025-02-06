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