"use client";

import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { useTheme } from "next-themes";
import {
	MessageSquare,
	ThumbsUp,
	Reply,
	MoreHorizontal,
	Send,
	Smile,
	Image as ImageIcon,
	X,
	Trash2,
	Edit,
	AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Comments } from "@/types/perfume";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { useDispatch } from "react-redux";
import {
	addComment,
	addReply,
	deleteComment,
	deleteReply,
} from "@/redux/perfume/perfumeReducer";
import { AppDispatch } from "@/redux/Store";
const CommentSection = ({
	comments: initialComments,
	perfumeId,
}: {
	comments: Comments[];
	perfumeId: string;
}) => {
	const user = useSelector((state: RootState) => state.user.profile);
	const [comments, setComments] = useState<Comments[]>(initialComments);
	const [commentText, setCommentText] = useState("");
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [replyText, setReplyText] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const [showEmojiForReply, setShowEmojiForReply] = useState(false);
	const [commentImages, setCommentImages] = useState<string[]>([]);
	const [replyImages, setReplyImages] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const replyFileInputRef = useRef<HTMLInputElement>(null);
	const { theme } = useTheme();

	const handleDeleteComment = async (commentId: string, userId: string) => {
		// Check if this comment belongs to the user
		if (user?.id !== userId) {
			toast("Permission denied", {
				description: "You can only delete your own comments",
				duration: 3000,
			});
			return;
		}

		try {
			await dispatch(deleteComment({ commentId })).unwrap();

			toast("Comment deleted", {
				description: "Comment has been removed.",
				duration: 3000,
			});
		} catch (error) {
			toast("Error deleting comment", {
				description: String(error),
				duration: 3000,
			});
		}
	};

	const handleDeleteReply = async (
		replyId: string,
		commentId: string,
		userId: string,
	) => {
		// Check if this reply belongs to the user
		if (user?.id !== userId) {
			toast("Permission denied", {
				description: "You can only delete your own replies",
				duration: 3000,
			});
			return;
		}

		try {
			await dispatch(deleteReply({ replyId, commentId })).unwrap();

			toast("Reply deleted", {
				description: "Reply has been removed.",
				duration: 3000,
			});
		} catch (error) {
			toast("Error deleting reply", {
				description: String(error),
				duration: 3000,
			});
		}
	};

	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		forReply: boolean = false,
	) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newImages: string[] = [];
		Array.from(files).forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					if (forReply) {
						setReplyImages((prev) => [
							...prev,
							e.target!.result as string,
						]);
					} else {
						setCommentImages((prev) => [
							...prev,
							e.target!.result as string,
						]);
					}
				}
			};
			reader.readAsDataURL(file);
		});

		// Reset file input
		e.target.value = "";
	};

	// Inside component:
	const dispatch = useDispatch<AppDispatch>();

	const handleCommentSubmit = async () => {
		if (!commentText.trim() && fileInputRef.current?.files?.length === 0)
			return;

		try {
			// Get files from the file input
			const files = fileInputRef.current?.files
				? Array.from(fileInputRef.current.files)
				: [];

			await dispatch(
				addComment({
					perfumeId: perfumeId, // Add this prop to your component
					text: commentText,
					imagesFiles: files,
				}),
			).unwrap();

			setCommentText("");
			if (fileInputRef.current) fileInputRef.current.value = "";
			setCommentImages([]);
			setShowEmoji(false);

			toast("Comment posted!", {
				description: "Your comment has been added successfully.",
				duration: 3000,
			});
		} catch (error) {
			toast("Error posting comment", {
				description: String(error),
				duration: 3000,
			});
		}
	};

	const handleReplySubmit = async (commentId: string) => {
		if (!replyText.trim() && replyFileInputRef.current?.files?.length === 0)
			return;

		try {
			// Get files from the file input
			const files = replyFileInputRef.current?.files
				? Array.from(replyFileInputRef.current.files)
				: [];

			await dispatch(
				addReply({
					commentId,
					text: replyText,
					imagesFiles: files,
				}),
			).unwrap();

			setReplyText("");
			if (replyFileInputRef.current) replyFileInputRef.current.value = "";
			setReplyImages([]);
			setReplyingTo(null);
			setShowEmojiForReply(false);

			toast("Reply posted!", {
				description: "Your reply has been added successfully.",
				duration: 3000,
			});
		} catch (error) {
			toast("Error posting reply", {
				description: String(error),
				duration: 3000,
			});
		}
	};

	const toggleLike = (
		commentId: string,
		isReply = false,
		parentId?: string | null,
	) => {
		const userId = user?.id || "guest123";

		if (isReply) {
			const updatedComments = comments.map((comment) => {
				if (comment.id === parentId) {
					const updatedReplies = comment.replies.map((reply) => {
						if (reply.id === commentId) {
							// Check if user already liked
							const alreadyLiked = reply.likes.includes(userId);

							return {
								...reply,
								likes: alreadyLiked
									? reply.likes.filter((id) => id !== userId)
									: [...reply.likes, userId],
							};
						}
						return reply;
					});
					return { ...comment, replies: updatedReplies };
				}
				return comment;
			});
			setComments(updatedComments);
		} else {
			const updatedComments = comments.map((comment) => {
				if (comment.id === commentId) {
					// Check if user already liked
					const alreadyLiked = comment.likes.includes(userId);

					return {
						...comment,
						likes: alreadyLiked
							? comment.likes.filter((id) => id !== userId)
							: [...comment.likes, userId],
					};
				}
				return comment;
			});
			setComments(updatedComments);
		}
	};

	const removeImage = (index: number, forReply: boolean = false) => {
		if (forReply) {
			setReplyImages((prev) => prev.filter((_, i) => i !== index));
		} else {
			setCommentImages((prev) => prev.filter((_, i) => i !== index));
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.toUpperCase();
	};

	const formatTimestamp = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);

		if (diffSec < 60) return "Just now";
		if (diffMin < 60) return `${diffMin}m ago`;
		if (diffHour < 24) return `${diffHour}h ago`;
		if (diffDay < 7) return `${diffDay}d ago`;

		return date.toLocaleDateString();
	};

	const isUserVerified = (userId: string = "") => {
		// This would be a real check in a production app
		return ["user1", "user2"].includes(userId);
	};

	return (
		<Card className="w-full border-border/50 bg-background shadow-sm rounded-lg mt-8">
			<CardHeader className="pb-3">
				<CardTitle className="text-xl flex items-center">
					<MessageSquare className="h-5 w-5 mr-2 text-primary" />
					Comments ({comments.length})
				</CardTitle>
			</CardHeader>

			<CardContent className="pb-4 space-y-4">
				{/* Comment input */}
				<div className="space-y-4">
					<div className="flex gap-3">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={
									user?.images ||
									"https://i.pravatar.cc/150?img=12"
								}
							/>
							<AvatarFallback>
								{user?.name ? getInitials(user.name) : "U"}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1">
							<Textarea
								placeholder="Write a comment..."
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								className="min-h-[60px] w-full resize-none border rounded-md mb-2"
							/>

							{commentImages.length > 0 && (
								<div className="flex flex-wrap gap-2 my-2">
									{commentImages.map((img, index) => (
										<div key={index} className="relative">
											<img
												src={img}
												alt="Comment attachment"
												className="h-16 w-16 object-cover rounded-md"
											/>
											<button
												className="absolute top-0 right-0 bg-background/50 rounded-full p-0.5"
												onClick={() =>
													removeImage(index)
												}
											>
												<X className="h-3 w-3 text-foreground" />
											</button>
										</div>
									))}
								</div>
							)}

							<div className="flex justify-between items-center mt-2">
								<div className="flex gap-2">
									<input
										type="file"
										ref={fileInputRef}
										accept="image/*"
										multiple
										className="hidden"
										onChange={(e) => handleImageUpload(e)}
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											fileInputRef.current?.click()
										}
									>
										<ImageIcon className="h-4 w-4 mr-1" />{" "}
										Add Image
									</Button>

									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowEmoji(!showEmoji)}
									>
										<Smile className="h-4 w-4 mr-1" /> Emoji
									</Button>
									<div className="relative">
										{showEmoji && (
											<div className="absolute mt-1 z-50">
												<EmojiPicker
													onEmojiClick={(
														emojiObject,
													) => {
														setCommentText(
															(prev) =>
																prev +
																emojiObject.emoji,
														);
														setShowEmoji(false);
													}}
													lazyLoadEmojis
													theme={
														theme === "dark"
															? EmojiTheme.DARK
															: EmojiTheme.LIGHT
													}
												/>
											</div>
										)}
									</div>
								</div>

								<Button
									size="sm"
									disabled={
										!commentText.trim() &&
										commentImages.length === 0
									}
									onClick={handleCommentSubmit}
								>
									<Send className="h-5 w-5" />
								</Button>
							</div>
						</div>
					</div>
				</div>

				<Separator className="bg-border/50 my-4" />

				{/* Comments list */}
				<div className="space-y-6">
					<AnimatePresence>
						{comments.map((comment) => (
							<motion.div
								key={comment.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3 }}
								className="space-y-4"
							>
								<div className="flex gap-3">
									<Avatar className="h-10 w-10 border border-border/50">
										<AvatarImage
											src={comment.user_data.avatar}
										/>
										<AvatarFallback>
											{getInitials(
												comment.user_data.name,
											)}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 space-y-2">
										<div className="bg-secondary/10 p-3 rounded-2xl shadow-sm border-0">
											<div className="flex justify-between items-start">
												<div className="flex items-center gap-2">
													<h4 className="font-semibold text-foreground">
														{comment.user_data.name}
													</h4>
													{isUserVerified(
														comment.user_data.id,
													) && (
														<Badge
															variant="outline"
															className="h-5 px-1 text-xs bg-primary/10 text-primary border-primary/30"
														>
															Verified
														</Badge>
													)}
												</div>

												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant="ghost"
															size="sm"
															className="h-8 w-8 p-0"
														>
															<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-[160px]"
													>
														{comment.user_data
															.id ===
															user?.id && (
															<>
																<DropdownMenuItem>
																	<Edit className="h-4 w-4 mr-2" />
																	Edit
																</DropdownMenuItem>
																<DropdownMenuSeparator />
															</>
														)}
														{comment.user_data
															.id === user?.id ? (
															<DropdownMenuItem
																className="text-destructive focus:text-destructive"
																onClick={() =>
																	handleDeleteComment(
																		comment.id ||
																			"",
																		user?.id ||
																			"",
																	)
																}
															>
																<Trash2 className="h-4 w-4 mr-2" />
																Delete
															</DropdownMenuItem>
														) : (
															<DropdownMenuItem>
																<AlertCircle className="h-4 w-4 mr-2" />
																Report
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</div>

											<p className="mt-1 text-card-foreground">
												{comment.text}
											</p>

											{/* Comment Images */}
											{comment.images &&
												comment.images.length > 0 && (
													<div
														className={`grid gap-2 mt-2 ${comment.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
													>
														{comment.images.map(
															(img, i) => (
																<img
																	key={i}
																	src={img}
																	alt="Comment attachment"
																	className="rounded-md max-h-60 w-full object-cover"
																/>
															),
														)}
													</div>
												)}
										</div>

										<div className="flex items-center gap-4 pl-1">
											<Button
												variant="ghost"
												size="sm"
												className={`h-7 px-2 text-xs font-medium ${comment.likes.includes(user?.id || "guest123") ? "text-primary" : "text-muted-foreground"}`}
												onClick={() =>
													toggleLike(comment.id || "")
												}
											>
												<ThumbsUp
													className={`h-3.5 w-3.5 mr-1 ${comment.likes.includes(user?.id || "guest123") ? "fill-primary" : ""}`}
												/>
												{comment.likes.length > 0 &&
													comment.likes.length}{" "}
												{comment.likes.length === 1
													? "Like"
													: "Likes"}
											</Button>

											<Button
												variant="ghost"
												size="sm"
												className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
												onClick={() =>
													setReplyingTo(
														comment.id || "",
													)
												}
											>
												<Reply className="h-3.5 w-3.5 mr-1" />
												Reply
											</Button>

											<span className="text-xs text-muted-foreground">
												{formatTimestamp(
													comment.created_at,
												)}
											</span>
										</div>

										{/* Reply input */}
										<AnimatePresence>
											{replyingTo === comment.id && (
												<motion.div
													initial={{
														opacity: 0,
														height: 0,
													}}
													animate={{
														opacity: 1,
														height: "auto",
													}}
													exit={{
														opacity: 0,
														height: 0,
													}}
													transition={{
														duration: 0.2,
													}}
													className="mt-3 pl-1"
												>
													<div className="flex gap-2">
														<Avatar className="h-8 w-8">
															<AvatarImage
																src={
																	user?.images ||
																	"https://i.pravatar.cc/150?img=12"
																}
															/>
															<AvatarFallback>
																{user?.name
																	? getInitials(
																			user.name,
																		)
																	: "U"}
															</AvatarFallback>
														</Avatar>

														<div className="flex-1">
															<Textarea
																placeholder={`Reply to ${comment.user_data.name}...`}
																value={
																	replyText
																}
																onChange={(e) =>
																	setReplyText(
																		e.target
																			.value,
																	)
																}
																className="min-h-[60px] resize-none mb-2"
															/>

															{replyImages.length >
																0 && (
																<div className="flex flex-wrap gap-2 mb-2">
																	{replyImages.map(
																		(
																			img,
																			index,
																		) => (
																			<div
																				key={
																					index
																				}
																				className="relative"
																			>
																				<img
																					src={
																						img
																					}
																					alt="Reply attachment"
																					className="h-16 w-16 object-cover rounded-md"
																				/>
																				<button
																					className="absolute top-0 right-0 bg-background rounded-full p-0.5"
																					onClick={() =>
																						removeImage(
																							index,
																							true,
																						)
																					}
																				>
																					<X className="h-3 w-3 text-foreground" />
																				</button>
																			</div>
																		),
																	)}
																</div>
															)}

															<div className="flex justify-between items-center">
																<div className="flex gap-2">
																	<input
																		type="file"
																		ref={
																			replyFileInputRef
																		}
																		accept="image/*"
																		multiple
																		className="hidden"
																		onChange={(
																			e,
																		) =>
																			handleImageUpload(
																				e,
																				true,
																			)
																		}
																	/>
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			replyFileInputRef.current?.click()
																		}
																	>
																		<ImageIcon className="h-4 w-4 mr-1" />{" "}
																		Image
																	</Button>

																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			setShowEmojiForReply(
																				!showEmojiForReply,
																			)
																		}
																	>
																		<Smile className="h-4 w-4 mr-1" />{" "}
																		Emoji
																	</Button>

																	<div className="relative">
																		{showEmojiForReply && (
																			<div className="absolute z-50">
																				<EmojiPicker
																					onEmojiClick={(emojiObject: {
																						emoji: string;
																					}) => {
																						setReplyText(
																							(
																								prev,
																							) =>
																								prev +
																								emojiObject.emoji,
																						);
																						setShowEmojiForReply(
																							false,
																						);
																					}}
																					lazyLoadEmojis
																					theme={
																						theme ===
																						"dark"
																							? EmojiTheme.DARK
																							: EmojiTheme.LIGHT
																					}
																				/>
																			</div>
																		)}
																	</div>
																</div>

																<div className="flex gap-2">
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() => {
																			setReplyingTo(
																				null,
																			);
																			setReplyText(
																				"",
																			);
																			setReplyImages(
																				[],
																			);
																		}}
																	>
																		Cancel
																	</Button>

																	<Button
																		size="sm"
																		disabled={
																			!replyText.trim() &&
																			replyImages.length ===
																				0
																		}
																		onClick={() =>
																			handleReplySubmit(
																				comment.id ||
																					"",
																			)
																		}
																	>
																		<Reply className="h-4 w-4 mr-1" />{" "}
																		Reply
																	</Button>
																</div>
															</div>
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>

										{/* Replies */}
										{comment.replies.length > 0 && (
											<div className="pl-4 border-l border-border/30 space-y-4 mt-3">
												{comment.replies.map(
													(reply) => (
														<div
															key={reply.id}
															className="flex gap-2"
														>
															<Avatar className="h-8 w-8 border border-border/50">
																<AvatarImage
																	src={
																		reply
																			.user_data
																			?.avatar ||
																		"https://i.pravatar.cc/150?img=12"
																	}
																/>
																<AvatarFallback>
																	{getInitials(
																		reply
																			.user_data
																			?.name ||
																			"",
																	)}
																</AvatarFallback>
															</Avatar>

															<div className="flex-1 space-y-2">
																<div className="bg-secondary/10 p-2.5 rounded-2xl shadow-sm">
																	<div className="flex justify-between items-start">
																		<div className="flex items-center gap-2">
																			<h4 className="font-semibold text-foreground text-sm">
																				{
																					reply
																						.user_data
																						?.name
																				}
																			</h4>
																			{isUserVerified(
																				reply
																					.user_data
																					?.id,
																			) && (
																				<Badge
																					variant="outline"
																					className="h-4 px-1 text-[10px] bg-primary/10 text-primary border-primary/30"
																				>
																					Verified
																				</Badge>
																			)}
																		</div>

																		<DropdownMenu>
																			<DropdownMenuTrigger
																				asChild
																			>
																				<Button
																					variant="ghost"
																					size="sm"
																					className="h-6 w-6 p-0"
																				>
																					<MoreHorizontal className="h-3 w-3 text-muted-foreground" />
																				</Button>
																			</DropdownMenuTrigger>
																			<DropdownMenuContent
																				align="end"
																				className="w-[160px]"
																			>
																				{reply
																					.user_data
																					?.id ===
																					user?.id && (
																					<>
																						<DropdownMenuItem>
																							<Edit className="h-4 w-4 mr-2" />
																							Edit
																						</DropdownMenuItem>
																						<DropdownMenuSeparator />
																					</>
																				)}
																				{reply
																					.user_data
																					?.id ===
																				user?.id ? (
																					<DropdownMenuItem
																						className="text-destructive focus:text-destructive"
																						onClick={() =>
																							handleDeleteReply(
																								reply.id ||
																									"",
																								comment.id ||
																									"",
																								user?.id ||
																									"",
																							)
																						}
																					>
																						<Trash2 className="h-4 w-4 mr-2" />
																						Delete
																					</DropdownMenuItem>
																				) : (
																					<DropdownMenuItem>
																						<AlertCircle className="h-4 w-4 mr-2" />
																						Report
																					</DropdownMenuItem>
																				)}
																			</DropdownMenuContent>
																		</DropdownMenu>
																	</div>

																	<p className="mt-1 text-card-foreground text-sm">
																		{
																			reply.text
																		}
																	</p>

																	{/* Reply Images */}
																	{reply.images &&
																		reply
																			.images
																			.length >
																			0 && (
																			<div
																				className={`grid gap-2 mt-2 ${reply.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
																			>
																				{reply.images.map(
																					(
																						img,
																						i,
																					) => (
																						<img
																							key={
																								i
																							}
																							src={
																								img
																							}
																							alt="Reply attachment"
																							className="rounded-md max-h-48 w-full object-cover"
																						/>
																					),
																				)}
																			</div>
																		)}
																</div>

																<div className="flex items-center gap-3 pl-1">
																	<Button
																		variant="ghost"
																		size="sm"
																		className={`h-6 px-1.5 text-xs font-medium ${reply.likes.includes(user?.id || "guest123") ? "text-primary" : "text-muted-foreground"}`}
																		onClick={() =>
																			toggleLike(
																				reply.id ||
																					"",
																				true,
																				comment.id,
																			)
																		}
																	>
																		<ThumbsUp
																			className={`h-3 w-3 mr-1 ${reply.likes.includes(user?.id || "guest123") ? "fill-primary" : ""}`}
																		/>
																		{reply
																			.likes
																			.length >
																			0 &&
																			reply
																				.likes
																				.length}{" "}
																		{reply
																			.likes
																			.length ===
																		1
																			? "Like"
																			: "Likes"}
																	</Button>

																	<span className="text-xs text-muted-foreground">
																		{formatTimestamp(
																			reply.created_at,
																		)}
																	</span>
																</div>
															</div>
														</div>
													),
												)}
											</div>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>

					{comments.length === 0 && (
						<div className="text-center py-8">
							<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30" />
							<h3 className="mt-2 text-lg font-medium text-muted-foreground">
								No comments yet
							</h3>
							<p className="text-sm text-muted-foreground/70">
								Be the first to share your thoughts!
							</p>
						</div>
					)}
				</div>
			</CardContent>

			<CardFooter className="border-t border-border/50 bg-background/50 py-3">
				<div className="w-full flex justify-between items-center text-xs text-muted-foreground">
					<span>
						{comments.length}{" "}
						{comments.length === 1 ? "comment" : "comments"}
					</span>
					<Button variant="ghost" size="sm" className="text-xs">
						Refresh
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default CommentSection;
