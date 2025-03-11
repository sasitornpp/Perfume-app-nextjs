"use client";

import React, { useEffect, useState } from "react";
import { supabaseClient } from "@/utils/supabase/client";
import PerfumeCard from "@/components/perfume_card";
import { Perfume } from "@/types/perfume";

function PerfumeIdCard({ perfumeId }: { perfumeId: string[] }) {
	const [perfume, setPerfume] = useState<Perfume[]>([]);

	useEffect(() => {
		async function fetchPerfume() {
			try {
				const { data, error } = await supabaseClient
					.from("perfumes")
					.select()
					.in("id", perfumeId);
				if (error) throw error;
				setPerfume(data || []);
			} catch (error: any) {
				console.error("Error fetching perfume:", error.message);
			}
		}
		fetchPerfume();
	}, [perfumeId]);

	return (
		<>
			{perfume.map((perfume, index) => (
				<PerfumeCard key={perfume.id} perfume={perfume} index={index}/>
			))}
		</>
	);
}

export default PerfumeIdCard;
