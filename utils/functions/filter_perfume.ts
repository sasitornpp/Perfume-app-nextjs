import { Perfume, Filters, TradablePerfume } from '@/types/perfume';

const filterPerfumes = (perfumes: Perfume[] | TradablePerfume[], filters: Filters): (Perfume | TradablePerfume)[] => {
  const {
    searchQuery,
    brand,
    gender,
    accords,
    top_notes,
    middle_notes,
    base_notes,
  } = filters;

  return perfumes
    .filter(perfume => {
      // Handle searchQuery filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          perfume.name?.toLowerCase() ?? '',
          perfume.brand?.toLowerCase() ?? '',
          perfume.gender?.toLowerCase() ?? '',
          perfume.descriptions?.toLowerCase() ?? '',
          ...(perfume.accords?.map(accord => accord.toLowerCase()) ?? []),
          ...(perfume.topNotes?.map(note => note.toLowerCase()) ?? []),
          ...(perfume.middleNotes?.map(note => note.toLowerCase()) ?? []),
          ...(perfume.baseNotes?.map(note => note.toLowerCase()) ?? []),
        ];

        if (!searchFields.some(field => field.includes(query))) {
          return false;
        }
      }

      // Handle other filters
      if (gender) {
        const perfumeGender = perfume.gender?.toLowerCase() ?? '';
        if (!perfumeGender.includes(gender.toLowerCase())) return false;
      }

      if (brand) {
        const perfumeBrand = perfume.brand?.toLowerCase() ?? '';
        if (!perfumeBrand.includes(brand.toLowerCase())) return false;
      }

      const checkNotes = (notes: string[], filterNotes: string[]) => 
        filterNotes.every(fn => 
          notes.some(n => n.toLowerCase().includes(fn.toLowerCase()))
        );

      if (accords?.length) {
        const perfumeAccords = perfume.accords?.map(a => a.toLowerCase()) ?? [];
        if (!checkNotes(perfumeAccords, accords)) return false;
      }

      if (top_notes?.length) {
        const notes = perfume.topNotes?.map(n => n.toLowerCase()) ?? [];
        if (!checkNotes(notes, top_notes)) return false;
      }

      if (middle_notes?.length) {
        const notes = perfume.middleNotes?.map(n => n.toLowerCase()) ?? [];
        if (!checkNotes(notes, middle_notes)) return false;
      }

      if (base_notes?.length) {
        const notes = perfume.baseNotes?.map(n => n.toLowerCase()) ?? [];
        if (!checkNotes(notes, base_notes)) return false;
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

export default filterPerfumes;