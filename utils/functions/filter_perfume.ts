import { Perfume, Filters, TradablePerfume } from "@/types/perfume";

export function getUniqueBrandsWithLogo(
	perfumes: Perfume[],
): { brand: string; logo: string }[] {
	const brandMap = new Map<string, string>();

	perfumes.forEach((perfume) => {
		if (!brandMap.has(perfume.brand)) {
			brandMap.set(perfume.brand, perfume.logo);
		}
	});

	return Array.from(brandMap, ([brand, logo]) => ({ brand, logo }));
}