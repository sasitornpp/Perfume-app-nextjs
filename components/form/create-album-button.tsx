import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, ImagePlus } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { addNewAlbum } from "@/redux/user/userReducer";

// Define the form schema with zod
const formSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	description: z.string().optional(),
	isPrivate: z.boolean().default(false),
	// We'll handle image separately since it's not easily managed with zod
});

interface AlbumData {
	title: string;
	description: string;
	isPrivate: boolean;
	image: File | null;
}

interface CreateAlbumButtonProps {
	onCreateAlbum: (data: AlbumData) => void;
}

const CreateAlbumButton = ({ onCreateAlbum }: CreateAlbumButtonProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// Initialize the form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			isPrivate: false,
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target && e.target.result) {
					setImagePreview(e.target.result as string);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// Prepare the data for the parent component
		dispatch(
			addNewAlbum({
				album: {
					title: values.title,
					descriptions: values.description || "",
					private: values.isPrivate,
					perfumes_id: [],
					likes: [],
					images: null,
					imageFile: imageFile,
				},
			}),
		);

		// Reset form and state
		form.reset();
		setImagePreview(null);
		setImageFile(null);
		setIsDialogOpen(false);
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button
					className="flex items-center gap-2"
					onClick={() => setIsDialogOpen(true)}
				>
					<Plus size={16} />
					<span>Create Album</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create New Album</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Album title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Add a description for your album"
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isPrivate"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel>Private Album</FormLabel>
										<FormDescription>
											Only you will be able to see this
											album
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormItem>
							<FormLabel>Cover Image</FormLabel>
							<div className="flex flex-col items-center gap-4">
								{imagePreview ? (
									<div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
										<img
											src={imagePreview}
											alt="Preview"
											className="w-full h-full object-cover"
										/>
										<Button
											type="button"
											variant="secondary"
											size="sm"
											className="absolute bottom-2 right-2"
											onClick={() => {
												setImagePreview(null);
												setImageFile(null);
											}}
										>
											Change
										</Button>
									</div>
								) : (
									<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/50 hover:bg-muted/70">
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Click to upload image
											</p>
										</div>
										<Input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageChange}
										/>
									</label>
								)}
							</div>
						</FormItem>

						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									form.reset();
									setImagePreview(null);
									setImageFile(null);
									setIsDialogOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button type="submit">Create Album</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateAlbumButton;
