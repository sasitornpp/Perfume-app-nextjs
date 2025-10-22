"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/Store";
import { Perfume } from "@/types/perfume";
import { fetchSellersByPerfume } from "@/redux/filters/filterPerfumesReducer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SellersListProps {
    perfume: Perfume;
}

const SellersList = ({ perfume }: SellersListProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // mark component as mounted to avoid SSR issues
    useEffect(() => {
        setMounted(true);
        if (perfume) {
            dispatch(fetchSellersByPerfume(perfume.name));
        }
    }, [dispatch, perfume]);

    const { sellers: sellersMap, loading } = useSelector(
        (state: RootState) => state.filters
    );

    if (!mounted) return null;

    if (loading)
        return <div className="text-muted-foreground">Loading merchants...</div>;

    const allSellers = Object.values(sellersMap || {}).flat();


    if (allSellers.length === 0)
        return <div className="text-muted-foreground">No merchants found.</div>;

    return (
        <div className="grid grid-cols-1 gap-4">
            {allSellers.map((seller) => (
                <div
                    key={seller.perfume_id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                >
                    <div className="flex items-center space-x-4">
                        <img
                            src={seller.seller_image || "/default-avatar.png"}
                            alt={seller.seller_name || "Unknown Merchant"}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        <div>
                            <div className="text-xs text-gray-500">Seller</div>
                            <div className="font-semibold">{seller.seller_name || "Unknown Merchant"}</div>
                        </div>
                    </div>

                    <Button
                        onClick={() => router.push(`/perfumes/${seller.perfume_id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Visit
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default SellersList;
