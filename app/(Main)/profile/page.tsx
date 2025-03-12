"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/Store";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	User,
	Settings,
	ShoppingBasket,
	Sprout,
	Heart,
	Edit,
	Share2,
	Star,
	ClipboardCheck,
	ArrowRight,
	Album,
	PlusCircle,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import PerfumeCard from "@/components/perfume_card";
// import { Separator } from "@/components/ui/separator";
import AlbumCard from "@/components/album-card";
import CreateAlbumButton from "@/components/form/create-album-button";
import { getPerfumeById } from "@/utils/supabase/api/perfume";
import { Perfume } from "@/types/perfume";
import { removePerfumeFromBasket } from "@/redux/user/userReducer";
import PerfumeIdCard from "@/components/perfume-id-card";
import Link from "next/link";
// import { createSelector } from "@reduxjs/toolkit";



const selectMyAlbums = (state: RootState) => state.user.albums;

const selectMyPerfumes = (state: RootState) => state.user.perfumes;

const selectMyBaskets = (state: RootState) => state.user.basket;

const selectMyLikes = (state: RootState) => state.user.profile?.likes;

function ProfilePage() {
	const searchParams = useSearchParams();
	const dispatch: AppDispatch = useDispatch();
	const router = useRouter();
	const queryTab = searchParams.get("q");
	const validTabs = [
		"my-perfumes",
		"albums",
		"basket",
		"recommendations",
		"likes",
	];
	const activeTab = validTabs.includes(queryTab ?? "")
		? (queryTab ?? "my-perfumes")
		: "my-perfumes";

	const profile = useSelector((state: RootState) => state.user.profile);
	const isProfileComplete = !!profile && Object.keys(profile).length > 0;

	// const perfume_ids = profile?.my_perfume || [];
    const selectMySuggestedPerfumes = (state: RootState) =>
        state.user.profile?.suggestions_perfumes;
    
	const my_perfumes = useSelector(selectMyPerfumes);
	const my_albums = useSelector(selectMyAlbums);
	const suggestionsPerfumes = useSelector(selectMySuggestedPerfumes);
	const my_baskets = useSelector(selectMyBaskets);
	const my_likes = useSelector(selectMyLikes);
	// Handle tab change and update URL
	const handleTabChange = (value: string) => {
		router.push(`/profile?q=${value}`, { scroll: false });
	};

	const handleRemoveBasket = (id: string) => {
		dispatch(removePerfumeFromBasket({ basketId: id }));
		// dispatch(updateBasket({ basket: updatedBasket }));
	};

	// console.log(my_likes);

	// If profile doesn't exist, show the create profile UI
	if (!isProfileComplete) {
		return (
			<div className="container mx-auto py-12 max-w-3xl px-4 mt-20 rounded-xl">
				<Card className="overflow-hidden border-2 border-primary/10">
					<CardHeader className="bg-primary/5 pb-8">
						<div className="mx-auto bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mb-6">
							<User className="h-12 w-12 text-primary/50" />
						</div>
						<CardTitle className="text-2xl text-center">
							Complete Your Profile
						</CardTitle>
						<CardDescription className="text-center text-base mt-2">
							We need some information to personalize your
							experience
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-8 px-6">
						<div className="space-y-6">
							<div className="flex items-start gap-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<ClipboardCheck className="h-6 w-6 text-primary" />
								</div>
								<div className="space-y-1">
									<h3 className="font-medium">
										Create Your Perfume Profile
									</h3>
									<p className="text-sm text-muted-foreground">
										Tell us about your preferences to get
										personalized fragrance recommendations
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<Sprout className="h-6 w-6 text-primary" />
								</div>
								<div className="space-y-1">
									<h3 className="font-medium">
										Build Your Collection
									</h3>
									<p className="text-sm text-muted-foreground">
										Track your perfumes and organize your
										collection in one place
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<Heart className="h-6 w-6 text-primary" />
								</div>
								<div className="space-y-1">
									<h3 className="font-medium">
										Get Personalized Recommendations
									</h3>
									<p className="text-sm text-muted-foreground">
										Discover new fragrances that match your
										taste and preferences
									</p>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-sm text-muted-foreground text-center sm:text-left">
							This will only take about 2 minutes
						</p>
						<Button
							size="lg"
							className="w-full sm:w-auto flex items-center justify-center gap-2"
							onClick={() => router.push("/survey-form")}
						>
							<span>Start Survey</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-6 mt-20">
			{/* Profile Header */}
			<div className="flex flex-col md:flex-row gap-6 items-start mb-8">
				<div className="relative">
					<Avatar className="h-28 w-28 border-4 border-primary">
						<AvatarImage
							src={profile?.images?.split(",")[0] || ""}
							alt={profile?.name || "User"}
						/>
						<AvatarFallback className="bg-primary text-primary-foreground text-2xl">
							{profile?.name?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
					<Button
						size="sm"
						variant="outline"
						className="absolute -bottom-2 -right-2 rounded-full p-2 h-auto"
					>
						<Edit className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex-1">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl font-bold">
								{profile.name || "Your Profile"}
							</h1>
							<p className="text-muted-foreground">
								{profile.bio ||
									"Add a bio to tell people about yourself"}
							</p>
						</div>

						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								className="flex items-center gap-1"
							>
								<Share2 className="h-4 w-4" />
								<span>Share</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="flex items-center gap-1"
								onClick={() => router.push("/profile/settings")}
							>
								<Settings className="h-4 w-4" />
								Settings
							</Button>
						</div>
					</div>

					<div className="flex gap-4 mt-4">
						<div className="flex items-center gap-1">
							<User className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								{profile?.gender || "Not specified"}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<Sprout className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								Member since{" "}
								{profile?.created_at
									? new Date(
											profile.created_at,
										).toLocaleDateString()
									: "Recently"}
							</span>
						</div>
					</div>

					<div className="flex gap-2 mt-4">
						{/* <Badge
							variant="secondary"
							className="bg-primary/10 hover:bg-primary/20"
						>
							{perfume_ids.length} Perfumes
						</Badge> */}
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs
				value={activeTab}
				className="w-full"
				onValueChange={handleTabChange}
			>
				<TabsList className="w-full grid grid-cols-5 mb-6">
					<TabsTrigger
						value="my-perfumes"
						className="flex items-center gap-2"
					>
						<Sprout className="h-4 w-4" />
						<span>My Perfumes</span>
					</TabsTrigger>
					<TabsTrigger
						value="recommendations"
						className="flex items-center gap-2"
					>
						<Star className="h-4 w-4" />
						<span>Recommendations</span>
					</TabsTrigger>
					<TabsTrigger
						value="albums"
						className="flex items-center gap-2"
					>
						<Album className="h-4 w-4" />
						<span>My Albums</span>
					</TabsTrigger>
					<TabsTrigger
						value="likes"
						className="flex items-center gap-2"
					>
						<Heart className="h-4 w-4" />
						<span>My Likes</span>
					</TabsTrigger>
					<TabsTrigger
						value="basket"
						className="flex items-center gap-2"
					>
						<ShoppingBasket className="h-4 w-4" />
						<span>Basket</span>
					</TabsTrigger>
				</TabsList>

				{/* My Perfumes Tab */}
				<TabsContent value="my-perfumes">
					<div className="flex flex-wrap justify-center gap-4 p-4">
						{my_perfumes?.length !== 0 && (
							<>
								{my_perfumes?.map((perfume, index) => (
									<PerfumeCard
										key={perfume.id}
										perfume={perfume}
										index={index}
									/>
								))}
								<div className="transition-all duration-300 hover:z-50 my-4">
									<Card
										className="w-[300px] overflow-hidden border-2 relative rounded-lg cursor-pointer"
										onClick={() =>
											router.push("/perfumes/create")
										}
									>
										<CardContent className="flex flex-col h-[420px] p-0 overflow-hidden">
											<div className="relative overflow-hidden w-full  h-full from-background to-muted flex items-center justify-center">
												<div>
													<div className="flex items-center justify-center bg-primary/10 p-6 rounded-full">
														<PlusCircle className="h-16 w-16 text-primary" />
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</>
						)}
						{/* Empty State - Only shown when no perfumes exist and replaces the card above */}
						{my_perfumes?.length === 0 && (
							<div className="w-full max-w-md p-8 text-center bg-card rounded-lg border border-border shadow-sm my-8">
								<div className="flex flex-col items-center">
									<div className="rounded-full bg-muted p-4 mb-4">
										<Sprout className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-xl font-medium mb-2">
										Start Your Collection
									</h3>
									<p className="text-muted-foreground mb-6 max-w-xs">
										Track your fragrances, record
										impressions, and build your personal
										scent library
									</p>
									<Button
										size="lg"
										onClick={() =>
											router.push("/perfumes/create")
										}
										className="gap-2"
									>
										<PlusCircle className="h-4 w-4" />
										Add Your First Perfume
									</Button>
								</div>
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="recommendations">
					<div className="flex flex-wrap gap-4 justify-center">
						{suggestionsPerfumes &&
						suggestionsPerfumes.length > 0 ? (
							suggestionsPerfumes.map((perfume, index) => (
								<PerfumeCard
									key={perfume.id}
									perfume={perfume}
									index={index}
								/>
							))
						) : (
							<div className="col-span-full p-8 text-center">
								<Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium mb-2">
									No Recommendations Yet
								</h3>
								<p className="text-muted-foreground mb-4">
									Add more perfumes to your collection to get
									personalized recommendations
								</p>
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="albums">
					<div className="mb-6 flex justify-end">
						<CreateAlbumButton
							onCreateAlbum={(albumData) => {
								// Handle the new album creation here
								console.log("New album:", albumData);
								// You might want to call an API or update your state here
							}}
						/>
					</div>
					<div className="flex flex-wrap gap-4 justify-center">
						{my_albums && my_albums.length > 0 ? (
							my_albums.map((album) =>
								album.id ? (
									<AlbumCard
										key={album.id}
										album={album as any}
									/>
								) : null,
							)
						) : (
							<div className="col-span-full p-8 text-center">
								<Album className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium mb-2">
									No wishlist added yet
								</h3>
								<p className="text-muted-foreground mb-4">
									Add more perfumes to your collection to get
									personalized recommendations
								</p>
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="likes">
					<div className="flex flex-wrap justify-center gap-4 p-4">
						{my_likes && my_likes.length > 0 ? (
							<PerfumeIdCard perfumeId={my_likes} />
						) : (
							<div className="w-full max-w-md p-8 text-center bg-card rounded-lg border border-border shadow-sm my-8">
								<div className="flex flex-col items-center">
									<div className="rounded-full bg-muted p-4 mb-4">
										<Heart className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-xl font-medium mb-2">
										No Liked Perfumes Yet
									</h3>
									<p className="text-muted-foreground mb-6 max-w-xs">
										Explore perfumes and like your favorites
										to see them here
									</p>
									<Button
										size="lg"
										onClick={() =>
											router.push("/perfumes/home/search")
										}
										className="gap-2"
									>
										<Heart className="h-4 w-4" />
										Discover Perfumes
									</Button>
								</div>
							</div>
						)}
					</div>
				</TabsContent>

				{/* Basket Tab */}
				<TabsContent value="basket">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{my_baskets && my_baskets.length > 0 ? (
							my_baskets?.map((basket, index) => {
								const [perfume, setPerfume] =
									useState<Perfume | null>(null);

								useEffect(() => {
									const fetchPerfume = async () => {
										const perfumeData =
											await getPerfumeById({
												id: basket.perfume_id,
											});
										setPerfume(perfumeData);
									};

									fetchPerfume();
								}, [basket.perfume_id]);

								if (!perfume)
									return <div key={index}>Loading...</div>;

								return (
									<Link
										href={`/perfumes/${perfume.id}`}
										key={perfume.id}
									>
										<Card
											key={perfume.id}
											className="overflow-hidden group transition-all duration-300 hover:shadow-lg"
										>
											<div className="h-48 bg-accent/20 relative">
												{perfume.images &&
												perfume.images.length > 0 ? (
													<img
														src={perfume.images[0]}
														alt={perfume.name}
														className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-accent/10">
														<span className="text-muted-foreground">
															No image
														</span>
													</div>
												)}
												{perfume.gender && (
													<div className="absolute top-2 right-2 bg-background text-foreground text-xs px-2 py-1 rounded-full">
														{perfume.gender}
													</div>
												)}
											</div>
											<CardHeader className="pb-1">
												<div className="flex justify-between items-start">
													<div>
														<CardTitle className="text-base font-medium">
															{perfume.name}
														</CardTitle>
														<CardDescription className="text-sm text-primary/80">
															{perfume.brand}
														</CardDescription>
													</div>
													<Badge
														variant="outline"
														className="ml-2 text-xs"
													>
														{perfume.concentration ||
															"EDP"}
													</Badge>
												</div>
												{perfume.scent_type && (
													<p className="text-xs text-muted-foreground mt-1">
														{perfume.scent_type}
													</p>
												)}
											</CardHeader>
											<CardFooter className="pt-0 flex justify-between items-center">
												<div>
													<span className="font-semibold text-primary">
														฿
														{perfume.price?.toLocaleString()}
													</span>
													<span className="text-xs text-muted-foreground ml-1">
														{perfume.volume}ml
													</span>
													<span className="text-xs text-muted-foreground ml-1">
														Amount: {basket.amount}
													</span>
												</div>
												<Button
													variant="destructive"
													size="sm"
													className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
													onClick={() =>
														handleRemoveBasket(
															basket?.id,
														)
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="mr-1"
													>
														<path d="M3 6h18"></path>
														<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
														<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
													</svg>
													Remove
												</Button>
											</CardFooter>
										</Card>
									</Link>
								);
							})
						) : (
							<div className="col-span-full p-8 text-center">
								<ShoppingBasket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium mb-2">
									Your basket is empty
								</h3>
								<p className="text-muted-foreground mb-4">
									Browse recommendations or search for
									perfumes to add them to your basket
								</p>
								<Button
									onClick={() =>
										router.push("/perfumes/home/search")
									}
								>
									Explore Perfumes
								</Button>
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default ProfilePage;
