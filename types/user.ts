import { Perfume } from "./perfume";

export interface User {
  id: string;
  name: string;
  bio: string;
  gender: string;
  images: string;
  suggestions_perfumes: Perfume[];
  perfume_id: string[];
  created_at: Date;
}