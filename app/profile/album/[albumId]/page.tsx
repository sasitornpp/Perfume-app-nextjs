"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Heart,
	Lock,
	Unlock,
	Image as ImageIcon,
	Plus,
	AlertCircle,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { fetchAlbumById } from "@/utils/supabase/api/perfume";
import { removeAlbum } from "@/redux/user/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import AlbumEditModal from "@/components/album/album-edit-modal";
import PerfumeCard from "@/components/perfume_card";

// Import your interfaces
import { AlbumWithPerfume, AlbumForInsert } from "@/types/perfume";

const AlbumPage = ({ params }: { params: Promise<{ albumId: string }> }) => {
	const dispatch = useDispatch<AppDispatch>();
	const [album, setAlbum] = useState<AlbumWithPerfume | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const unwrappedParams = React.use(params);
	const albumId = unwrappedParams?.albumId;
	const router = useRouter();

	const currentUserId = useSelector(
		(state: RootState) => state.user.profile?.id,
	);

	// Fetch the single album
	useEffect(() => {
		const fetchAlbum = async () => {
			if (!currentUserId) return;

			if (albumId) {
				try {
					const albumData = await fetchAlbumById({
						id: albumId,
						userId: currentUserId,
					});
					setAlbum(albumData);
				} catch (error) {
					setError(
						error instanceof Error
							? error.message
							: "An unknown error occurred",
					);
				} finally {
					setLoading(false);
				}
			}
		};

		if (albumId) {
			fetchAlbum();
		}
	}, [albumId, currentUserId]);

	const isLiked = currentUserId
		? album?.likes.includes(currentUserId)
		: false;

	const handleUpdateAlbum = async () => {
		if (!albumId || !currentUserId) return;

		try {
			setIsEditModalOpen(false);
		} catch (error) {
			console.error("Error updating album:", error);
			setError(
				error instanceof Error
					? error.message
					: "An error occurred while updating the album",
			);
		}
	};

	const handleDeleteAlbum = async () => {
		if (!albumId || !currentUserId) return;

		try {
			await dispatch(removeAlbum({ albumId: albumId }));
			router.push("/profile?q=albums");
		} catch (error) {
			console.error("Error deleting album:", error);
			setError(
				error instanceof Error
					? error.message
					: "An error occurred while deleting the album",
			);
		}
	};

	if (loading) {
		return (
			<div className="flex h-64 items-center justify-center mt-20">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="mt-2 text-sm text-muted-foreground">
						Loading album...
					</p>
				</div>
			</div>
		);
	}

	if (error || !album) {
		return (
			<div className="container mx-auto py-8 mt-20">
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>

				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
					<ImageIcon className="mb-4 h-16 w-16 text-muted-foreground" />
					<h3 className="text-xl font-medium">Album not found</h3>
					<p className="mt-2 text-muted-foreground">
						The album you're looking for doesn't exist or you don't
						have permission to view it.
					</p>
					<Button className="mt-6" onClick={() => router.back()}>
						Return to Albums
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 mt-20">
			{/* Edit Modal */}
			{album && (
				<AlbumEditModal
					album={album}
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					onSave={handleUpdateAlbum}
				/>
			)}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="space-y-6"
			>
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-foreground">
						{album.title}
					</h1>

					<div className="flex gap-2">
						<Button variant="outline" onClick={() => router.back()}>
							Return to Albums
						</Button>
						<Button
							variant="outline"
							className="flex items-center gap-2"
						>
							{album.private ? (
								<>
									<Lock size={16} />
									Private
								</>
							) : (
								<>
									<Unlock size={16} />
									Public
								</>
							)}
						</Button>

						<Button
							className="flex items-center gap-2"
							onClick={() => router.push(`/perfumes/home/search`)}
						>
							<Plus size={16} />
							Add Perfume
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="md:col-span-2">
						<Card className="h-full">
							<CardHeader>
								<CardTitle>Perfumes in this Album</CardTitle>
								<CardDescription>
									{album.descriptions ||
										"No description provided"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex justify-center gap-4">
									{album.perfumes &&
									album.perfumes.length > 0 ? (
										album.perfumes.map((perfume, index) =>
											perfume ? (
												<PerfumeCard
													key={perfume.id}
													perfume={perfume}
													index={index}
													toggleLike={false}
												/>
											) : null,
										)
									) : (
										<div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
											<ImageIcon className="mb-2 h-12 w-12 text-muted-foreground" />
											<h3 className="text-lg font-medium">
												No perfumes added yet
											</h3>
											<p className="text-sm text-muted-foreground">
												Add your first perfume to this
												album
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					<div>
						<Card>
							<CardHeader>
								<CardTitle>Album Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="relative h-48 w-full mb-4">
									{album.images ? (
										<img
											src={album.images as string}
											alt={album.title}
											className="h-full w-full rounded-md object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
											<ImageIcon className="h-12 w-12 text-muted-foreground" />
										</div>
									)}
								</div>

								<div>
									<h4 className="text-sm font-medium mb-1">
										Created
									</h4>
									<p className="text-sm text-muted-foreground">
										{new Date(
											album.created_at,
										).toLocaleDateString()}
									</p>
								</div>

								<div>
									<h4 className="text-sm font-medium mb-1">
										Likes
									</h4>
									<div className="flex items-center">
										<Heart
											className={`h-4 w-4 ${isLiked ? "fill-current text-red-500 mr-2" : ""}`}
										/>
										<span>
											{album.likes
												? album.likes.length
												: 0}{" "}
											likes
										</span>
									</div>
								</div>

								<div>
									<h4 className="text-sm font-medium mb-1">
										Visibility
									</h4>
									<Badge
										variant={
											album.private
												? "secondary"
												: "outline"
										}
									>
										{album.private ? "Private" : "Public"}
									</Badge>
								</div>

								<div className="pt-4">
									<Button
										variant="outline"
										className="w-full"
									>
										Share Album
									</Button>
								</div>

								{album.user_id === currentUserId && (
									<div className="flex gap-2">
										<Button
											variant="secondary"
											className="flex-1"
											onClick={() =>
												setIsEditModalOpen(true)
											}
										>
											Edit
										</Button>
										<Button
											variant="destructive"
											className="flex-1"
											onClick={handleDeleteAlbum}
										>
											Delete
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default AlbumPage;
