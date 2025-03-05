import { suggestedPerfume, Filters } from "./perfume";

export interface Profile {
    id: string;
    name: string | null;
    bio: string | null;
    gender: string;
    images: string | null;
    suggestions_perfumes: suggestedPerfume[] | null;
    my_perfume: string[] | null;
    wishlist: string[] | null;
    basket: string[] | null;
    created_at: Date;
}
