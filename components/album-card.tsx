import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Album, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Perfume } from "@/types/perfume";
import { useRouter } from "next/navigation";

interface AlbumCardProps {
	album: {
		id: string;
		title: string;
		descriptions: string | null;
		private: boolean;
		perfumes: Perfume[];
		perfumes_id: string[];
		created_at: string;
	};
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
	const router = useRouter();

	// Get up to 4 perfume images to display
	const perfumeImages: (string | null)[] = album.perfumes
		? album.perfumes
			.filter((perfume) => perfume.images && perfume.images.length > 0)
			.map((perfume) => perfume.images?.[0])
			.slice(0, 4)
		: [];

	// Fill with placeholder if less than 4 images
	while (perfumeImages.length < 4) {
		perfumeImages.push(null);
	}

	const totalPerfumes = album.perfumes_id.length;
	const formattedDate = new Date(album.created_at).toLocaleDateString();

	const handleViewAlbum = () => {
		router.push(`/albums/${album.id}`);
	};

	return (
		<Card className="w-full max-w-xs overflow-hidden transition-all hover:shadow-md">
			<div className="relative">
				{/* Image Grid */}
				<div className="grid grid-cols-2 grid-rows-2 h-48">
					{perfumeImages.map((image, index) => (
						<div
							key={index}
							className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/20"
						>
							{image ? (
								<img
									src={image}
									alt={`Perfume ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Album className="h-6 w-6 text-primary/40" />
								</div>
							)}
						</div>
					))}
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
				{album.descriptions && (
					<p className="text-xs text-muted-foreground line-clamp-2 h-9">
						{album.descriptions}
					</p>
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
				<Button variant="outline" size="sm" onClick={handleViewAlbum}>
					View
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AlbumCard;
