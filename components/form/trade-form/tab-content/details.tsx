"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Info as InfoCircledIcon } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PerfumeForInsert, PerfumeForUpdate } from "@/types/perfume";
import { Checkbox } from "@/components/ui/checkbox";
import BrandsInput from "@/components/form/trade-form/brands-input";

const TabDetails = ({
	containerVariants,
	itemVariants,
	formData,
	handleChange,
	setFormData,
}: {
	containerVariants: any;
	itemVariants: any;
	formData: PerfumeForInsert | PerfumeForUpdate;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	setFormData: React.Dispatch<
		React.SetStateAction<PerfumeForInsert | PerfumeForUpdate>
	>;
}) => {
	const [isNotForSale, setIsNotForSale] = useState(false);
	useEffect(() => {
		const shouldBeNotForSale =
			formData.price === null && !formData.is_tradable;
		if (isNotForSale !== shouldBeNotForSale) {
			setIsNotForSale(shouldBeNotForSale);
		}
	}, [formData.price, formData.is_tradable]);

	// console.log("formData:", formData);

	return (
		<TabsContent value="details" className="m-0 p-0">
			<div className="p-6 space-y-8">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-8"
				>
					{/* Essential Information Card */}
					<Card className="border border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-primary/5 pb-3">
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg font-medium text-primary">
										Essential Information
									</CardTitle>
									<CardDescription className="text-muted-foreground">
										These details are required to list your
										perfume
									</CardDescription>
								</div>
								<span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
									Required
								</span>
							</div>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								{/* Name Field */}
								<div className="space-y-2">
									<Label
										htmlFor="name"
										className="font-medium"
									>
										Perfume Name{" "}
										<span className="text-destructive">
											*
										</span>
									</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="e.g. Bleu de Chanel"
										className="border-input/60 focus-visible:ring-primary/20"
										required
									/>
								</div>

								{/* Gender Field */}
								<div className="space-y-2">
									<Label
										htmlFor="gender"
										className="font-medium"
									>
										Gender{" "}
										<span className="text-destructive">
											*
										</span>
									</Label>
									<Select
										name="gender"
										value={formData.gender || ""}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												gender: value,
											}))
										}
										required
									>
										<SelectTrigger
											id="gender"
											className="border-input/60 focus-visible:ring-primary/20"
										>
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">
												Male
											</SelectItem>
											<SelectItem value="female">
												Female
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									{/* <div className="flex items-center space-x-2">
										<Checkbox
											id="notForSale"
											checked={isNotForSale}
											onCheckedChange={(checked) =>
												setIsNotForSale(
													checked === true,
												)
											}
										/>
										<Label
											htmlFor="notForSale"
											className="font-medium text-sm cursor-pointer"
										>
											Not for sale (only for display)
										</Label>
									</div> */}
								</div>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								{/* Price Field - Only show if not checked as "Not for sale" */}
								{!isNotForSale && (
									<div className="space-y-2">
										<Label
											htmlFor="price"
											className="font-medium"
										>
											Price (THB){" "}
											<span className="text-destructive">
												*
											</span>
										</Label>
										<Input
											id="price"
											name="price"
											type="number"
											value={formData.price || ""}
											onChange={handleChange}
											placeholder="e.g. 2500"
											className="border-input/60 focus-visible:ring-primary/20"
											required={!isNotForSale}
										/>
									</div>
								)}

								{/* Volume Field */}
								{/* <div className="space-y-2">
									<Label
										htmlFor="volume"
										className="font-medium"
									>
										Volume (ml){" "}
										<span className="text-destructive">
											*
										</span>
									</Label>
									<Input
										id="volume"
										name="volume"
										type="number"
										value={formData.volume || ""}
										onChange={handleChange}
										placeholder="e.g. 100"
										className="border-input/60 focus-visible:ring-primary/20"
										required
									/>
								</div> */}
							</motion.div>

							{/* Description Field */}
							<motion.div
								variants={itemVariants}
								className="space-y-2"
							>
								<Label
									htmlFor="descriptions"
									className="font-medium"
								>
									Description{" "}
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="descriptions"
									name="descriptions"
									value={formData.descriptions}
									onChange={handleChange}
									placeholder="Describe the perfume's scent, longevity, projection, and why someone might want it..."
									className="min-h-28 border-input/60 focus-visible:ring-primary/20"
									required
								/>
								<p className="text-xs text-muted-foreground">
									A good description increases your chances of
									finding interested traders
								</p>
							</motion.div>
						</CardContent>
					</Card>

					{/* Additional Information Card */}
					{/* <Card className="border border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-muted/20 pb-3">
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg font-medium text-foreground">
										Additional Details
									</CardTitle>
									<CardDescription className="text-muted-foreground">
										Extra information to make your listing
										stand out
									</CardDescription>
								</div>
								<span className="px-2 py-1 text-xs font-medium rounded-md bg-muted/40 text-muted-foreground">
									Optional
								</span>
							</div>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								<BrandsInput
									formData={formData}
									setFormData={setFormData}
								/>

		
								<div className="space-y-2">
									<Label
										htmlFor="perfumer"
										className="font-medium"
									>
										Perfumer
									</Label>
									<Input
										id="perfumer"
										name="perfumer"
										value={formData.perfumer || ""}
										onChange={handleChange}
										placeholder="e.g. François Demachy"
										className="border-input/60 focus-visible:ring-primary/20"
									/>
								</div>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
					
								<div className="space-y-2">
									<Label
										htmlFor="concentration"
										className="font-medium"
									>
										Concentration
									</Label>
									<Select
										name="concentration"
										value={formData.concentration || ""}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												concentration: value,
											}))
										}
									>
										<SelectTrigger
											id="concentration"
											className="border-input/60 focus-visible:ring-primary/20"
										>
											<SelectValue placeholder="Select concentration" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="extrait">
												Extrait de Parfum
											</SelectItem>
											<SelectItem value="eau_de_parfum">
												Eau de Parfum
											</SelectItem>
											<SelectItem value="eau_de_toilette">
												Eau de Toilette
											</SelectItem>
											<SelectItem value="eau_de_cologne">
												Eau de Cologne
											</SelectItem>
											<SelectItem value="cologne">
												Cologne
											</SelectItem>
											<SelectItem value="eau_fraiche">
												Eau Fraîche
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

				
								<div className="space-y-2">
									<Label
										htmlFor="scentType"
										className="font-medium"
									>
										Scent Type
									</Label>
									<Select
										name="scentType"
										value={formData.scent_type || ""}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												scent_type: value,
											}))
										}
									>
										<SelectTrigger
											id="scentType"
											className="border-input/60 focus-visible:ring-primary/20"
										>
											<SelectValue placeholder="Select scent type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="woody">
												Woody
											</SelectItem>
											<SelectItem value="floral">
												Floral
											</SelectItem>
											<SelectItem value="oriental">
												Oriental
											</SelectItem>
											<SelectItem value="fresh">
												Fresh
											</SelectItem>
											<SelectItem value="citrus">
												Citrus
											</SelectItem>
											<SelectItem value="aromatic">
												Aromatic
											</SelectItem>
											<SelectItem value="gourmand">
												Gourmand
											</SelectItem>
											<SelectItem value="spicy">
												Spicy
											</SelectItem>
											<SelectItem value="green">
												Green
											</SelectItem>
											<SelectItem value="aquatic">
												Aquatic
											</SelectItem>
											<SelectItem value="fougere">
												Fougère
											</SelectItem>
											<SelectItem value="chypre">
												Chypre
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</motion.div>

							<div className="flex items-center space-x-2 py-2 px-3 rounded-md bg-muted/10 border border-muted/20 text-sm">
								<InfoCircledIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
								<p className="text-muted-foreground">
									Complete these fields to increase visibility
									and help buyers find your listing
								</p>
							</div>
						</CardContent>
					</Card> */}
				</motion.div>
			</div>
		</TabsContent>
	);
};

export default TabDetails;
