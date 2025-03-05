"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
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
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import PerfumeCard from "@/components/perfume_card";
import { useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";
import AlbumCard from "@/components/album-card";

function ProfilePage() {
	const searchParams = useSearchParams();
	const dispatch = useDispatch();
	const router = useRouter();
	const queryTab = searchParams.get("q");
	const validTabs = ["my-perfumes", "albums", "basket", "recommendations"];
	const activeTab = validTabs.includes(queryTab ?? "")
		? (queryTab ?? "my-perfumes")
		: "my-perfumes";

	const profile = useSelector((state: RootState) => state.user.profile);
	const isProfileComplete = !!profile && Object.keys(profile).length > 0;

	// const perfume_ids = profile?.my_perfume || [];

	const my_perfumes = useSelector(
		(state: RootState) => state.user.perfumes || [],
	);
	const my_albums = useSelector(
		(state: RootState) => state.user?.albums || [],
	);

	const suggestionsPerfumes = useSelector(
		(state: RootState) => state.user.profile?.suggestions_perfumes || [],
	);

	const my_baskets = useSelector(
		(state: RootState) => state.user?.basket || [],
	);

	// Handle tab change and update URL
	const handleTabChange = (value: string) => {
		router.push(`/profile?q=${value}`, { scroll: false });
	};


	const handleRemoveBasket = (id: string) => {
		const updatedBasket = my_baskets.filter((item) => item !== id);
		// dispatch(updateBasket({ basket: updatedBasket }));
	};

    // console.log(profile);

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
				<TabsList className="w-full grid grid-cols-4 mb-6">
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
						<Heart className="h-4 w-4" />
						<span>My Albums</span>
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{my_perfumes.length > 0 ? (
							my_perfumes.map((perfume) => (
								<Card
									key={perfume.id}
									className="overflow-hidden group"
								>
									<div className="h-40 bg-accent/20 relative">
										{perfume.images && (
											<img
												src={perfume.images[0]}
												alt={perfume.name}
												className="w-full h-full object-cover"
											/>
										)}
										<div className="absolute top-2 right-2">
											<Badge className="bg-primary text-primary-foreground">
												Tradable
											</Badge>
										</div>
									</div>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">
											{perfume.name}
										</CardTitle>
										<CardDescription>
											{perfume.brand}
										</CardDescription>
									</CardHeader>
									<CardFooter className="pt-0 flex justify-between">
										<span className="text-sm text-muted-foreground">
											{perfume.concentration}
										</span>
										<Button
											variant="ghost"
											size="sm"
											className="opacity-0 group-hover:opacity-100 transition-opacity"
										>
											View Details
										</Button>
									</CardFooter>
								</Card>
							))
						) : (
							<div className="col-span-full p-8 text-center">
								<Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium mb-2">
									No perfumes added yet
								</h3>
								<p className="text-muted-foreground mb-4">
									Start building your collection by adding
									perfumes you own
								</p>
								<Button
									onClick={() =>
										router.push("/perfumes/trade/create")
									}
								>
									Add Your First Perfume
								</Button>
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="recommendations">
					<div className="flex flex-wrap gap-4 justify-center">
						{suggestionsPerfumes.length > 0 ? (
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
								<Button>Explore Perfumes</Button>
							</div>
						)}
					</div>
				</TabsContent>

				{/* Recommendations Tab */}
				<TabsContent value="albums">
					<div className="flex flex-wrap gap-4 justify-center">
						{my_albums.length > 0 ? (
							my_albums.map((album) => (
								<AlbumCard key={album.id} album={album} />
							))
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

				{/* Basket Tab */}
				<TabsContent value="basket">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{my_baskets.length > 0 ? (
							my_baskets.map((perfume) => (
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
												{perfume.concentration || "EDP"}
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
												{perfume.price.toLocaleString()}
											</span>
											<span className="text-xs text-muted-foreground ml-1">
												{perfume.volume}ml
											</span>
										</div>
										<Button
											variant="destructive"
											size="sm"
											className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
											onClick={() =>
												handleRemoveBasket(perfume.id)
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
							))
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
										router.push("/perfumes/trade")
									}
								>
									Explore Perfumes
								</Button>
							</div>
						)}
					</div>

					{my_baskets.length > 0 && (
						<div className="mt-6 p-4 bg-card rounded-lg border">
							<div className="flex justify-between items-center mb-4">
								<h3 className="font-medium">Basket Summary</h3>
								<span>{my_baskets.length} items</span>
							</div>
							<Separator className="mb-4" />
							<div className="flex justify-between items-center mb-6">
								<span className="font-bold">Total</span>
								<span className="font-bold">
									{my_baskets
										.reduce(
											(total, item) =>
												total +
												parseFloat(
													String(
														item.price || "",
													).replace("$", "") || "0",
												),
											0,
										)
										.toFixed(2)}{" "}
									THB
								</span>
							</div>
							<Button className="w-full">
								Proceed to Checkout
							</Button>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default ProfilePage;
