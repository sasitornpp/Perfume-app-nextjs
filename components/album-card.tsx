"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Album, Eye, EyeOff, Heart, MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleLikeAlbum } from "@/redux/user/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/Store";
import { useRouter } from "next/navigation";
import { Album as AlbumType } from "@/types/perfume";

const AlbumCard = ({ album }: { album: AlbumType }) => {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	const totalPerfumes = album.perfumes_id.length;
	const formattedDate = new Date(album.created_at).toLocaleDateString();

	const userId = useSelector((state: RootState) => state.user.user?.id);

	// This would need to be fetched from API in a real implementation
	// For now we'll use placeholder logic
	const perfumeImages =
		album.perfumes_id.length > 0
			? Array(4).fill(album.images || "") // Use album cover image or placeholder
			: Array(4).fill("");

	const handleViewAlbum = () => {
		router.push(`profile/album/${album.id}`);
	};

	const handleLike = () => {
		if (album.id) {
			dispatch(toggleLikeAlbum({ albumId: album.id }));
		}
	};

	// Check if userId is defined before using includes
	const isLiked = userId ? album.likes.includes(userId) : false;

	return (
		<Card className="w-full max-w-xs overflow-hidden transition-all hover:shadow-md">
			<div className="relative">
				{/* Image Grid */}
				<div className="flex h-48">
					{album.images ? (
						<Image
							src={album.images}
							alt="Perfume album cover"
							layout="fill"
							objectFit="cover"
						/>
					) : (
						<div className="flex items-center justify-center w-full h-48 bg-muted text-muted-foreground">
							<Album className="h-10 w-10 opacity-50 mr-2" />
							<span className="text-sm font-medium">
								No images
							</span>
						</div>
					)}
				</div>

				{/* Privacy Badge */}
				<div className="absolute top-2 left-2">
					<Badge
						variant={album.private ? "secondary" : "default"}
						className="flex items-center gap-1"
					>
						{album.private ? (
							<>
								<EyeOff className="h-3 w-3" />
								<span>Private</span>
							</>
						) : (
							<>
								<Eye className="h-3 w-3" />
								<span>Public</span>
							</>
						)}
					</Badge>
				</div>

				{/* Options menu */}
				<div className="absolute top-2 right-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 rounded-full bg-background/80"
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Edit Album</DropdownMenuItem>
							<DropdownMenuItem>Share Album</DropdownMenuItem>
							<DropdownMenuItem className="text-destructive">
								Delete Album
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<CardHeader className="pb-2">
				<CardTitle className="text-base line-clamp-1">
					{album.title}
				</CardTitle>
				{album.descriptions ? (
					<p className="text-xs text-muted-foreground line-clamp-2 h-9">
						{album.descriptions}
					</p>
				) : (
					<p className="text-xs text-muted-foreground line-clamp-2 h-9" />
				)}
			</CardHeader>

			<CardFooter className="pt-0 pb-3 flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					<span>
						{totalPerfumes} perfume{totalPerfumes !== 1 ? "s" : ""}
					</span>
					<span className="mx-1">•</span>
					<span>{formattedDate}</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className={`p-0 ${isLiked ? "text-red-500" : "text-muted-foreground"} hover:bg-transparent`}
						onClick={handleLike}
					>
						<Heart
							className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
						/>
						<span className="ml-1 text-xs">
							{album.likes.length}
						</span>
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleViewAlbum}
					>
						View
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default AlbumCard;
