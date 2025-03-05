// "use client";

// import React, { useState, useEffect, use } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "@/redux/Store";
// import { useRouter } from "next/navigation";
// import {
// 	ArrowLeft,
// 	Star,
// 	Heart,
// 	Share2,
// 	ShoppingBag,
// 	ChevronDown,
// 	Trash2,
// 	Edit,
// 	AlertTriangle,
// 	CheckCircle,
// 	XCircle,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// 	CardFooter,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import Image from "next/image";
// import { updateBasket } from "@/redux/user/userReducer";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogFooter,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import CommentSection from "@/components/comment-section";

// function PerfumePage({ params }: { params: Promise<{ perfumeId: string }> }) {
// 	const router = useRouter();
// 	const dispatch = useDispatch<AppDispatch>();
// 	const unwrappedParams = use(params);
// 	const userId = useSelector((state: RootState) => state.user.user?.id);
// 	const [activeImage, setActiveImage] = useState(0);
// 	const [showMore, setShowMore] = useState(false);
// 	const [liked, setLiked] = useState(false);
// 	const [loadingProgress, setLoadingProgress] = useState(0);
// 	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

// 	const [deleteConfirmationUsername, setDeleteConfirmationUsername] =
// 		useState("");

// 	const profile = useSelector((state: RootState) => state.user.profile);

// 	useEffect(() => {
// 		const timer = setTimeout(() => {
// 			setLoadingProgress(100);
// 		}, 500);

// 		return () => clearTimeout(timer);
// 	}, []);

// 	const perfume = useSelector((state: RootState) =>
// 		state.perfumes.tradablePerfumes.find(
// 			(p) => p.id === unwrappedParams.perfumeId,
// 		),
// 	);

// 	const basket = useSelector(
// 		(state: RootState) => state.user.profile?.basket || [],
// 	);

// 	const isInBasket = perfume ? basket.includes(perfume.id) : false;
// 	const isOwner = perfume?.user_id === userId;

// 	const handleUpdateBasket = (e: React.MouseEvent) => {
// 		e.stopPropagation();
// 		if (!perfume) return;

// 		if (isInBasket) {
// 			const updatedBasket = basket.filter((id) => id !== perfume.id);
// 			dispatch(updateBasket({ basket: updatedBasket }));
// 			toast.error(`${perfume.name} has been removed from your basket.`, {
// 				description: "Removed from basket.",
// 				duration: 3000,
// 			});
// 		} else {
// 			const updatedBasket = [...basket, perfume.id];
// 			dispatch(updateBasket({ basket: updatedBasket }));
// 			toast(`${perfume.name} has been added to your basket!`, {
// 				description: "Added to basket.",
// 				duration: 3000,
// 			});
// 		}
// 	};

// 	const handleDeletePerfume = () => {
// 		if (deleteConfirmationUsername === profile?.name) {
// 			// In a real application, you would call an API to delete the perfume here.
// 			console.log(
// 				`Perfume "${perfume?.name}" deleted by user "${deleteConfirmationUsername}"`,
// 			);
// 			setIsDeleteDialogOpen(false);
// 			toast("Perfume Deleted!", {
// 				description: `"${perfume?.name}" has been successfully deleted.`,
// 				duration: 4000,
// 				icon: <CheckCircle className="h-4 w-4 text-green-500" />,
// 			});
// 			router.push("/perfumes"); // Redirect to perfumes page after deletion
// 		} else {
// 			toast.error("Username verification failed.", {
// 				description:
// 					"Please enter your correct username to confirm deletion.",
// 				duration: 3000,
// 				icon: <XCircle className="h-4 w-4" />,
// 			});
// 		}
// 	};
// 	const handleGoBack = () => {
// 		router.back();
// 	};
// 	if (!perfume) {
// 		return (
// 			<div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
// 				<motion.div
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ duration: 0.5 }}
// 					className="w-full max-w-md"
// 				>
// 					<Button
// 						variant="ghost"
// 						className="mb-4 flex items-center"
// 						onClick={() => router.back()}
// 					>
// 						<ArrowLeft className="mr-2 h-4 w-4" />
// 						Back to previous page
// 					</Button>
// 					<Card className="w-full shadow-lg border-accent">
// 						<CardContent className="flex flex-col items-center justify-center p-12 text-center">
// 							<motion.div
// 								initial={{ scale: 0.8 }}
// 								animate={{ scale: 1, rotate: [0, 5, 0, -5, 0] }}
// 								transition={{ duration: 0.6 }}
// 							>
// 								<ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
// 							</motion.div>
// 							<h2 className="text-2xl font-bold mb-2 text-foreground">
// 								Perfume Not Found
// 							</h2>
// 							<p className="text-muted-foreground mb-6">
// 								We couldn't find the fragrance you're looking
// 								for.
// 							</p>
// 							<Button
// 								onClick={() => router.push("/perfumes")}
// 								className="bg-primary text-primary-foreground hover:bg-primary/90"
// 							>
// 								Discover Other Fragrances
// 							</Button>
// 						</CardContent>
// 					</Card>
// 				</motion.div>
// 			</div>
// 		);
// 	}

// 	const truncatedDescription =
// 		(perfume?.descriptions ?? "").length > 150
// 			? `${perfume.descriptions?.substring(0, 150)}...`
// 			: (perfume?.descriptions ?? "");

// 	return (
// 		<div className="container mx-auto px-4 py-8 bg-background min-h-screen">
// 			<Progress value={loadingProgress} className="w-full h-1 mb-6" />
// 			{/* Back Button Bar - Fixed Position */}
// 			<div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/30 shadow-sm">
// 				<div className="container mx-auto px-4 py-3 flex items-center">
// 					<Button
// 						variant="ghost"
// 						size="sm"
// 						className="flex items-center hover:bg-accent/20 transition-colors"
// 						onClick={handleGoBack}
// 					>
// 						<ArrowLeft className="mr-2 h-4 w-4" />
// 						<span className="font-medium">Back</span>
// 					</Button>
// 					<div className="ml-4 flex-1 truncate">
// 						<span className="text-sm font-medium text-muted-foreground">
// 							{perfume.brand}
// 						</span>
// 						<h2 className="text-sm font-semibold truncate">
// 							{perfume.name}
// 						</h2>
// 					</div>
// 				</div>
// 			</div>

// 			<motion.div
// 				initial={{ opacity: 0, y: 10 }}
// 				animate={{ opacity: 1, y: 0 }}
// 				transition={{ duration: 0.4 }}
// 			>
// 				<Button
// 					variant="ghost"
// 					className="mb-6 flex items-center hover:bg-accent/20 transition-colors"
// 					onClick={() => router.back()}
// 				>
// 					<ArrowLeft className="mr-2 h-4 w-4" />
// 					<span className="font-medium">Back to Collection</span>
// 				</Button>
// 			</motion.div>

// 			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
// 				{/* Left Column - Images */}
// 				<motion.div
// 					className="flex flex-col"
// 					initial={{ opacity: 0, x: -20 }}
// 					animate={{ opacity: 1, x: 0 }}
// 					transition={{ duration: 0.5, delay: 0.2 }}
// 				>
// 					<Card className="w-full overflow-hidden border-0 bg-transparent shadow-none rounded-lg">
// 						<CardContent className="p-0 relative">
// 							<motion.div
// 								key={activeImage}
// 								initial={{ opacity: 0 }}
// 								animate={{ opacity: 1 }}
// 								exit={{ opacity: 0 }}
// 								transition={{ duration: 0.5 }}
// 								className="relative aspect-square w-full overflow-hidden rounded-xl bg-accent/5 justify-center items-center flex"
// 							>
// 								<Image
// 									src={perfume.images[activeImage]}
// 									alt={`${perfume.name} - Image ${
// 										activeImage + 1
// 									}`}
// 									width={400}
// 									height={500}
// 									className="object-cover transition-transform hover:scale-105 duration-700"
// 									priority
// 								/>
// 								<motion.button
// 									className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-md z-10"
// 									whileHover={{ scale: 1.1 }}
// 									whileTap={{ scale: 0.95 }}
// 									onClick={() => setLiked(!liked)}
// 								>
// 									<Heart
// 										className={`h-5 w-5 ${
// 											liked
// 												? "fill-destructive text-destructive"
// 												: "text-foreground"
// 										}`}
// 									/>
// 								</motion.button>
// 							</motion.div>

// 							<div className="flex mt-4 gap-3 overflow-x-auto pb-2 scrollbar-hide rounded-lg">
// 								{perfume.images.map((image, index) => (
// 									<motion.div
// 										key={index}
// 										className={`relative aspect-square w-20 h-20 flex-shrink-0 overflow-hidden rounded-md cursor-pointer border-2 ${
// 											activeImage === index
// 												? "border-primary"
// 												: "border-transparent"
// 										}`}
// 										onClick={() => setActiveImage(index)}
// 									>
// 										<Image
// 											src={image}
// 											alt={`${perfume.name} thumbnail ${
// 												index + 1
// 											}`}
// 											fill
// 											className="object-cover"
// 										/>
// 									</motion.div>
// 								))}
// 							</div>
// 						</CardContent>
// 					</Card>
// 					<CommentSection perfumeId={perfume.id} comments={perfume.comments}/>
// 				</motion.div>

// 				{/* Right Column - Details */}
// 				<motion.div
// 					className="flex flex-col rounded-lg"
// 					initial={{ opacity: 0, x: 20 }}
// 					animate={{ opacity: 1, x: 0 }}
// 					transition={{ duration: 0.5, delay: 0.3 }}
// 				>
// 					<Card className="w-full border-border/50 bg-card shadow-sm mb-6 rounded-lg">
// 						<CardHeader className="pb-3">
// 							<div className="flex items-center gap-3 mb-3">
// 								<div>
// 									<CardDescription className="text-lg font-medium text-primary">
// 										{perfume.brand}
// 									</CardDescription>
// 									<CardTitle className="text-3xl font-bold text-foreground mt-1">
// 										{perfume.name}
// 									</CardTitle>
// 								</div>
// 							</div>

// 							<div className="flex flex-wrap items-center gap-3 mt-2">
// 								<div className="flex items-center bg-secondary/30 px-3 py-1.5 rounded-full">
// 									<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
// 									<span className="ml-1 font-medium text-foreground">
// 										{(perfume.liked ?? 0).toFixed(1)}
// 									</span>
// 									<span className="mx-1 text-muted-foreground">
// 										·
// 									</span>
// 									<span className="text-muted-foreground text-sm">
// 										{perfume.total_votes} reviews
// 									</span>
// 								</div>
// 								<Badge className="bg-accent text-accent-foreground">
// 									{perfume.gender}
// 								</Badge>
// 								<Badge
// 									variant="outline"
// 									className="border-primary/30 text-primary bg-primary/5"
// 								>
// 									{new Date().getFullYear()} Edition
// 								</Badge>
// 							</div>
// 						</CardHeader>

// 						<CardContent className="pb-4">
// 							<AnimatePresence mode="wait">
// 								<motion.div>
// 									<p className="text-card-foreground leading-relaxed">
// 										{showMore
// 											? perfume.descriptions
// 											: truncatedDescription}
// 									</p>
// 									{(perfume?.descriptions ?? "").length >
// 										150 && (
// 										<Button
// 											variant="ghost"
// 											size="sm"
// 											onClick={() =>
// 												setShowMore(!showMore)
// 											}
// 											className="mt-2 text-primary p-0 h-auto"
// 										>
// 											{showMore
// 												? "Show less"
// 												: "Read more"}
// 											<ChevronDown
// 												className={`ml-1 h-4 w-4 transition-transform ${
// 													showMore ? "rotate-180" : ""
// 												}`}
// 											/>
// 										</Button>
// 									)}
// 								</motion.div>
// 							</AnimatePresence>

// 							{perfume.perfumer && (
// 								<div className="flex items-center mt-6 gap-2">
// 									<div className="relative h-8 w-8 overflow-hidden rounded-full">
// 										<Image
// 											src="https://i.pravatar.cc/150?img=68"
// 											alt={perfume.perfumer}
// 											fill
// 											className="object-cover"
// 										/>
// 									</div>
// 									<div>
// 										<p className="text-xs text-muted-foreground">
// 											Perfumer
// 										</p>
// 										<p className="text-sm font-medium text-foreground">
// 											{perfume.perfumer}
// 										</p>
// 									</div>
// 								</div>
// 							)}
// 						</CardContent>

// 						<Separator className="bg-border/50" />

// 						<CardContent className="pt-4">
// 							<p className="text-sm font-medium text-muted-foreground mb-3">
// 								Main accords
// 							</p>
// 							<div className="flex flex-wrap gap-2">
// 								{perfume.accords?.map((accord, index) => (
// 									<motion.div
// 										key={index}
// 										initial={{ opacity: 0, y: 10 }}
// 										animate={{ opacity: 1, y: 0 }}
// 										transition={{
// 											duration: 0.3,
// 											delay: index * 0.1,
// 										}}
// 									>
// 										<Badge
// 											variant="secondary"
// 											className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 transition-colors"
// 										>
// 											{accord}
// 										</Badge>
// 									</motion.div>
// 								))}
// 							</div>
// 						</CardContent>

// 						<CardFooter className="pt-3 pb-5 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
// 							<div className="flex gap-4 w-full">
// 								{isInBasket ? (
// 									<Button
// 										variant="destructive"
// 										className="flex-1 font-medium transition-all duration-300 group"
// 										onClick={handleUpdateBasket}
// 									>
// 										<Trash2 className="mr-2 h-4 w-4 group-hover:scale-110" />
// 										Remove from Basket
// 									</Button>
// 								) : (
// 									<Button
// 										className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm transition-all duration-300 hover:shadow-md group"
// 										onClick={handleUpdateBasket}
// 									>
// 										<ShoppingBag className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
// 										Add to Basket
// 									</Button>
// 								)}
// 								<Button
// 									variant="outline"
// 									className="border-border hover:bg-accent/10 transition-all duration-300"
// 									aria-label="Share"
// 								>
// 									<Share2 className="h-4 w-4" />
// 								</Button>
// 							</div>

// 							{isOwner && (
// 								<div className="flex gap-2 mt-4 md:mt-0">
// 									<Button
// 										variant="secondary"
// 										className="font-medium hover:bg-secondary/80 transition-colors group"
// 										onClick={() =>
// 											router.push(
// 												`/perfumes/edit/${perfume.id}`,
// 											)
// 										}
// 									>
// 										<Edit className="mr-2 h-4 w-4 group-hover:scale-110" />
// 										Edit Perfume
// 									</Button>

// 									<Dialog
// 										open={isDeleteDialogOpen}
// 										onOpenChange={setIsDeleteDialogOpen}
// 									>
// 										<DialogTrigger asChild>
// 											<Button
// 												variant="destructive"
// 												className="font-medium group"
// 											>
// 												<Trash2 className="mr-2 h-4 w-4 group-hover:scale-110" />
// 												Delete Perfume
// 											</Button>
// 										</DialogTrigger>
// 										<DialogContent className="sm:max-w-[400px]">
// 											<DialogHeader>
// 												<DialogTitle>
// 													Delete Perfume
// 												</DialogTitle>
// 												<DialogDescription>
// 													Are you sure you want to
// 													delete{" "}
// 													<span className="font-semibold">
// 														{perfume.name}
// 													</span>
// 													? This action cannot be
// 													undone.
// 													<br />
// 													<AlertTriangle className="inline-block h-4 w-4 mr-1 text-destructive align-top" />
// 													<span className="font-bold text-destructive">
// 														Warning
// 													</span>
// 													: Deleting this perfume is
// 													permanent.
// 												</DialogDescription>
// 											</DialogHeader>
// 											<div className="grid gap-4 py-4">
// 												<div className="grid grid-cols-4 items-center gap-4">
// 													<Label
// 														htmlFor="username"
// 														className="text-right"
// 													>
// 														Username
// 													</Label>
// 													<Input
// 														id="username"
// 														value={
// 															deleteConfirmationUsername
// 														}
// 														onChange={(e) =>
// 															setDeleteConfirmationUsername(
// 																e.target.value,
// 															)
// 														}
// 														className="col-span-3"
// 													/>
// 												</div>
// 											</div>
// 											<DialogFooter>
// 												<Button
// 													type="submit"
// 													variant="destructive"
// 													onClick={
// 														handleDeletePerfume
// 													}
// 												>
// 													Confirm Delete
// 												</Button>
// 											</DialogFooter>
// 										</DialogContent>
// 									</Dialog>
// 								</div>
// 							)}
// 						</CardFooter>
// 					</Card>

// 					<Card className="w-full border-border/50 bg-card shadow-sm rounded-lg">
// 						<CardContent className="p-0">
// 							<Tabs defaultValue="notes" className="w-full">
// 								<TabsList className="w-full grid grid-cols-2 rounded-lg border-b border-border/50">
// 									<TabsTrigger
// 										value="notes"
// 										className="rounded-none data-[state=active]:bg-background/50"
// 									>
// 										Fragrance Notes
// 									</TabsTrigger>
// 									<TabsTrigger
// 										value="details"
// 										className="rounded-none data-[state=active]:bg-background/50"
// 									>
// 										Details
// 									</TabsTrigger>
// 								</TabsList>

// 								<TabsContent
// 									value="notes"
// 									className="p-6 space-y-6"
// 								>
// 									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// 										<motion.div
// 											initial={{ opacity: 0, y: 10 }}
// 											animate={{ opacity: 1, y: 0 }}
// 											transition={{ duration: 0.4 }}
// 											className="space-y-3"
// 										>
// 											<div className="flex items-center gap-2">
// 												<Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
// 													Top
// 												</Badge>
// 												<h3 className="text-sm font-medium text-foreground">
// 													Top Notes
// 												</h3>
// 											</div>
// 											<ul className="space-y-2 pl-1">
// 												{perfume.top_note?.map(
// 													(note, index) => (
// 														<motion.li
// 															key={index}
// 															initial={{
// 																opacity: 0,
// 																x: -5,
// 															}}
// 															animate={{
// 																opacity: 1,
// 																x: 0,
// 															}}
// 															transition={{
// 																duration: 0.3,
// 																delay:
// 																	index * 0.1,
// 															}}
// 															className="flex items-center text-sm text-card-foreground"
// 														>
// 															<span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
// 															{note}
// 														</motion.li>
// 													),
// 												)}
// 											</ul>
// 										</motion.div>

// 										<motion.div
// 											initial={{ opacity: 0, y: 10 }}
// 											animate={{ opacity: 1, y: 0 }}
// 											transition={{
// 												duration: 0.4,
// 												delay: 0.1,
// 											}}
// 											className="space-y-3"
// 										>
// 											<div className="flex items-center gap-2">
// 												<Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
// 													Heart
// 												</Badge>
// 												<h3 className="text-sm font-medium text-foreground">
// 													Middle Notes
// 												</h3>
// 											</div>
// 											<ul className="space-y-2 pl-1">
// 												{perfume.middle_note?.map(
// 													(note, index) => (
// 														<motion.li
// 															key={index}
// 															initial={{
// 																opacity: 0,
// 																x: -5,
// 															}}
// 															animate={{
// 																opacity: 1,
// 																x: 0,
// 															}}
// 															transition={{
// 																duration: 0.3,
// 																delay:
// 																	index * 0.1,
// 															}}
// 															className="flex items-center text-sm text-card-foreground"
// 														>
// 															<span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
// 															{note}
// 														</motion.li>
// 													),
// 												)}
// 											</ul>
// 										</motion.div>

// 										<motion.div
// 											initial={{ opacity: 0, y: 10 }}
// 											animate={{ opacity: 1, y: 0 }}
// 											transition={{
// 												duration: 0.4,
// 												delay: 0.2,
// 											}}
// 											className="space-y-3"
// 										>
// 											<div className="flex items-center gap-2">
// 												<Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
// 													Base
// 												</Badge>
// 												<h3 className="text-sm font-medium text-foreground">
// 													Base Notes
// 												</h3>
// 											</div>
// 											<ul className="space-y-2 pl-1">
// 												{perfume.base_note?.map(
// 													(note, index) => (
// 														<motion.li
// 															key={index}
// 															initial={{
// 																opacity: 0,
// 																x: -5,
// 															}}
// 															animate={{
// 																opacity: 1,
// 																x: 0,
// 															}}
// 															transition={{
// 																duration: 0.3,
// 																delay:
// 																	index * 0.1,
// 															}}
// 															className="flex items-center text-sm text-card-foreground"
// 														>
// 															<span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
// 															{note}
// 														</motion.li>
// 													),
// 												)}
// 											</ul>
// 										</motion.div>
// 									</div>
// 								</TabsContent>

// 								<TabsContent
// 									value="details"
// 									className="p-6 rounded-lg"
// 								>
// 									<div className="space-y-4">
// 										<div className="grid grid-cols-2 gap-4">
// 											<div>
// 												<p className="text-sm text-muted-foreground mb-1">
// 													Launch Year
// 												</p>
// 												<p className="font-medium">
// 													2024
// 												</p>
// 											</div>
// 											<div>
// 												<p className="text-sm text-muted-foreground mb-1">
// 													Concentration
// 												</p>
// 												<p className="font-medium">
// 													Eau de Parfum
// 												</p>
// 											</div>
// 											<div>
// 												<p className="text-sm text-muted-foreground mb-1">
// 													Size Available
// 												</p>
// 												<p className="font-medium">
// 													50ml, 100ml
// 												</p>
// 											</div>
// 											<div>
// 												<p className="text-sm text-muted-foreground mb-1">
// 													Family
// 												</p>
// 												<p className="font-medium">
// 													{perfume.accords?.[0] ||
// 														"Oriental"}
// 												</p>
// 											</div>
// 										</div>

// 										<Separator className="bg-border/50" />

// 										<div>
// 											<p className="text-sm text-muted-foreground mb-2">
// 												Recommended for
// 											</p>
// 											<div className="flex flex-wrap gap-2">
// 												<Badge
// 													variant="outline"
// 													className="bg-background/50"
// 												>
// 													Evening
// 												</Badge>
// 												<Badge
// 													variant="outline"
// 													className="bg-background/50"
// 												>
// 													Special Occasions
// 												</Badge>
// 												<Badge
// 													variant="outline"
// 													className="bg-background/50"
// 												>
// 													Fall/Winter
// 												</Badge>
// 											</div>
// 										</div>
// 									</div>
// 								</TabsContent>
// 							</Tabs>
// 						</CardContent>
// 					</Card>
// 				</motion.div>
// 			</div>
// 		</div>
// 	);
// }

// export default PerfumePage;
