import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
	Perfume,
	TradablePerfumeForInsert,
	TradablePerfume,
} from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
import { Profile } from "@/types/profile";
import { v4 as uuidv4 } from "uuid";
import { Comments, Reply, User } from "@/types/perfume";

interface PerfumeState {
	perfumes: Perfume[];
	tradablePerfumes: TradablePerfume[];
	perfumes_by_page: {
		[page: number]: Perfume[];
	};
	selectedPerfume: { data: Perfume | null; errorMessages: string | null };
	selectedTradablePerfume: {
		data: TradablePerfume | null;
		errorMessages: string | null;
	};
	most_views_by_date: (Perfume | TradablePerfume)[];
	most_views_all_time: (Perfume | TradablePerfume)[];
	loading: boolean;
	error: string | null;
	fetchedPerfumePages: number[];
	fetchedTradablePerfumePages: number[];
}

const initialState: PerfumeState = {
	perfumes: [],
	perfumes_by_page: {},
	tradablePerfumes: [],
	selectedPerfume: { data: null, errorMessages: null },
	selectedTradablePerfume: { data: null, errorMessages: null },
	most_views_by_date: [],
	most_views_all_time: [],
	loading: false,
	error: null,
	fetchedPerfumePages: [],
	fetchedTradablePerfumePages: [],
};

// Add to your perfumeReducer.ts
export const deleteComment = createAsyncThunk(
	"perfume/deleteComment",
	async (
		{ commentId }: { commentId: string },
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to delete a comment");
			}

			// First, get the comment to check if user is authorized to delete it
			const { data: comment, error: fetchError } = await supabaseClient
				.from("comments")
				.select("user, images")
				.eq("id", commentId)
				.single();

			if (fetchError) throw fetchError;

			// Check if user is authorized (owns the comment)
			if (comment.user !== user.id) {
				throw new Error(
					"You don't have permission to delete this comment",
				);
			}

			// Get all image paths to delete from the comment
			let imagePathsToDelete: string[] = [];

			// Extract paths from comment images
			if (comment.images && comment.images.length > 0) {
				const commentImagePaths = comment.images
					.map((url: string) => {
						try {
							const urlObj = new URL(url);
							const pathMatch = urlObj.pathname.match(
								/\/storage\/v1\/object\/public\/IMAGES\/(.*)/,
							);
							return pathMatch ? pathMatch[1] : null;
						} catch {
							return null;
						}
					})
					.filter(Boolean) as string[];

				imagePathsToDelete = [
					...imagePathsToDelete,
					...commentImagePaths,
				];
			}

			// Get all replies for this comment
			const { data: replies, error: repliesError } = await supabaseClient
				.from("reply")
				.select("images")
				.eq("comments_id", commentId);

			if (!repliesError && replies && replies.length > 0) {
				// Extract paths from reply images
				for (const reply of replies) {
					if (reply.images && reply.images.length > 0) {
						const replyImagePaths = reply.images
							.map((url: string) => {
								try {
									const urlObj = new URL(url);
									const pathMatch = urlObj.pathname.match(
										/\/storage\/v1\/object\/public\/IMAGES\/(.*)/,
									);
									return pathMatch ? pathMatch[1] : null;
								} catch {
									return null;
								}
							})
							.filter(Boolean) as string[];

						imagePathsToDelete = [
							...imagePathsToDelete,
							...replyImagePaths,
						];
					}
				}
			}

			// Delete all collected images
			if (imagePathsToDelete.length > 0) {
				await rollbackUploadedFiles(imagePathsToDelete);
			}

			// Delete the comment (this will also delete all replies due to cascade delete in database)
			const { error: deleteError } = await supabaseClient
				.from("comments")
				.delete()
				.eq("id", commentId);

			if (deleteError) throw deleteError;

			return { commentId };
		} catch (error: any) {
			return rejectWithValue(error.message || "Failed to delete comment");
		}
	},
);

export const deleteReply = createAsyncThunk(
	"perfume/deleteReply",
	async (
		{ replyId, commentId }: { replyId: string; commentId: string },
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to delete a reply");
			}

			// First, get the reply to check if user is authorized to delete it
			const { data: reply, error: fetchError } = await supabaseClient
				.from("reply")
				.select("user, images")
				.eq("id", replyId)
				.single();

			if (fetchError) throw fetchError;

			// Check if user is authorized (owns the reply)
			if (reply.user !== user.id) {
				throw new Error(
					"You don't have permission to delete this reply",
				);
			}

			// Extract paths from reply images
			let imagePathsToDelete: string[] = [];
			if (reply.images && reply.images.length > 0) {
				imagePathsToDelete = reply.images
					.map((url: string) => {
						try {
							const urlObj = new URL(url);
							const pathMatch = urlObj.pathname.match(
								/\/storage\/v1\/object\/public\/IMAGES\/(.*)/,
							);
							return pathMatch ? pathMatch[1] : null;
						} catch {
							return null;
						}
					})
					.filter(Boolean) as string[];
			}

			// Delete images if any
			if (imagePathsToDelete.length > 0) {
				await rollbackUploadedFiles(imagePathsToDelete);
			}

			// Delete the reply
			const { error: deleteError } = await supabaseClient
				.from("reply")
				.delete()
				.eq("id", replyId);

			if (deleteError) throw deleteError;

			return { replyId, commentId };
		} catch (error: any) {
			return rejectWithValue(error.message || "Failed to delete reply");
		}
	},
);

// Updated addComment to handle file uploads
export const addComment = createAsyncThunk(
	"perfume/addComment",
	async (
		{
			perfumeId,
			text,
			imagesFiles = [],
		}: {
			perfumeId: string;
			text: string;
			imagesFiles?: File[];
		},
		{ rejectWithValue, getState },
	) => {
		let uploadedImages = null;

		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to comment");
			}

			// Upload images if any
			let imageUrls: string[] = [];
			if (imagesFiles.length > 0) {
				uploadedImages = await uploadImagesToSupabase(
					"Comments",
					imagesFiles,
				);

				if (
					!uploadedImages?.results ||
					uploadedImages.results.length === 0
				) {
					throw new Error("Failed to upload one or more images");
				}

				imageUrls = uploadedImages.results.map(
					(file) => file.publicUrl,
				);
			}

			// Insert the comment into the database
			const { data: newComment, error } = await supabaseClient
				.from("comments")
				.insert({
					perfumes_id: perfumeId,
					user: user.id,
					text,
					images: imageUrls,
					likes: [],
				})
				.select()
				.single();

			if (error) {
				// Rollback uploaded images if database insert fails
				if (uploadedImages && uploadedImages.uploadedFiles.length > 0) {
					await rollbackUploadedFiles(
						uploadedImages.uploadedFiles.map(
							(file) => file.filePath,
						),
					);
				}
				throw error;
			}

			// Transform the returned data to match our Comments interface
			const formattedComment: Comments = {
				id: newComment.id,
				user_data: {
					id: user.id,
					name: user.name || "",
					avatar: user.images || "",
				},
				text: newComment.text,
				images: imageUrls,
				likes: newComment.likes || [],
				created_at: newComment.created_at,
				replies: [],
			};

			return formattedComment;
		} catch (error: any) {
			return rejectWithValue(error.message || "Failed to add comment");
		}
	},
);

// Updated addReply to handle file uploads
export const addReply = createAsyncThunk(
	"perfume/addReply",
	async (
		{
			commentId,
			text,
			imagesFiles = [],
		}: {
			commentId: string;
			text: string;
			imagesFiles?: File[];
		},
		{ rejectWithValue, getState },
	) => {
		let uploadedImages = null;

		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to reply");
			}

			// Upload images if any
			let imageUrls: string[] = [];
			if (imagesFiles.length > 0) {
				uploadedImages = await uploadImagesToSupabase(
					"Replies",
					imagesFiles,
				);

				if (
					!uploadedImages?.results ||
					uploadedImages.results.length === 0
				) {
					throw new Error("Failed to upload one or more images");
				}

				imageUrls = uploadedImages.results.map(
					(file) => file.publicUrl,
				);
			}

			// Insert the reply into the database
			const { data: newReply, error } = await supabaseClient
				.from("reply")
				.insert({
					comments_id: commentId,
					user: user.id,
					text,
					images: imageUrls,
					likes: [],
				})
				.select()
				.single();

			if (error) {
				// Rollback uploaded images if database insert fails
				if (uploadedImages && uploadedImages.uploadedFiles.length > 0) {
					await rollbackUploadedFiles(
						uploadedImages.uploadedFiles.map(
							(file) => file.filePath,
						),
					);
				}
				throw error;
			}

			// Transform the returned data to match our Reply interface
			const formattedReply: Reply = {
				id: newReply.id,
				user_data: {
					id: user.id,
					name: user.name || "",
					avatar: user.images || "",
				},
				text: newReply.text,
				images: imageUrls,
				likes: newReply.likes || [],
				created_at: newReply.created_at,
			};

			return {
				reply: formattedReply,
				commentId: commentId,
			};
		} catch (error: any) {
			return rejectWithValue(error.message || "Failed to add reply");
		}
	},
);

const uploadImagesToSupabase = async (folder_name: string, images: File[]) => {
	const uploadedFiles: { filePath: string; publicUrl: string }[] = [];

	try {
		const results = await Promise.all(
			images.map(async (file) => {
				const fileExt = file.name.split(".").pop();
				const fileName = `${uuidv4()}.${fileExt}`;
				const filePath = `${folder_name}/${fileName}`;

				try {
					const { error } = await supabaseClient.storage
						.from("IMAGES")
						.upload(filePath, file);

					if (error) {
						return null;
					}

					const { data: publicUrlData } = supabaseClient.storage
						.from("IMAGES")
						.getPublicUrl(filePath);

					if (!publicUrlData) {
						return null;
					}

					uploadedFiles.push({
						filePath,
						publicUrl: publicUrlData.publicUrl,
					});
					return { filePath, publicUrl: publicUrlData.publicUrl };
				} catch (error) {
					return null;
				}
			}),
		);

		return {
			uploadedFiles,
			results: results.filter(
				(result): result is { filePath: string; publicUrl: string } =>
					result !== null,
			),
		};
	} catch (error) {
		await rollbackUploadedFiles(uploadedFiles.map((file) => file.filePath));
		return { uploadedFiles: [], results: [] };
	}
};

const rollbackUploadedFiles = async (filePaths: string[]) => {
	try {
		if (filePaths.length === 0) return;
		// console.log(filePaths);
		await supabaseClient.storage.from("IMAGES").remove(filePaths);
	} catch (error) {
		console.error("Error during rollback:", error);
	}
};

export const fetchPerfumeById = createAsyncThunk(
	"perfume/fetchPerfumeById",
	async (
		{ perfumeId }: { perfumeId: string },
		{ rejectWithValue, getState },
	) => {
		console.log("Starting fetchPerfumeById with ID:", perfumeId);

		try {
			const { perfumes: perfumeState } = getState() as {
				perfumes: PerfumeState;
			};
			console.log("Current perfume state:", perfumeState);

			// Check cache
			console.log("Checking cache for perfume ID:", perfumeId);
			const cachedPerfume = Object.values(perfumeState.perfumes_by_page)
				.flat()
				.find((p) => p.id === perfumeId);
			console.log("Cached perfume found:", cachedPerfume);

			let perfumeData: Perfume | null = cachedPerfume || null;

			// Fetch perfume data if not in cache
			if (!perfumeData) {
				console.log("Perfume not in cache, fetching from Supabase...");
				const { data, error } = await supabaseClient
					.from("perfumes")
					.select("*")
					.eq("id", perfumeId)
					.single();

				console.log("Supabase response - Data:", data);
				console.log("Supabase response - Error:", error);

				if (error) {
					if (error.code === "PGRST116") {
						console.log(
							"Perfume not found in database (PGRST116 error)",
						);
						return {
							data: null,
							errorMessages: "Perfume not found",
						};
					}
					console.error("Database error:", error);
					throw new Error(
						`Failed to fetch perfume: ${error.message}`,
					);
				}
				perfumeData = data as Perfume;
				console.log("Perfume data fetched from DB:", perfumeData);
			} else {
				console.log("Using cached perfume data:", perfumeData);
			}

			// Fetch comments
			let comments: any[] = [];
			console.log("Fetching comments for perfume ID:", perfumeId);
			try {
				const { data: commentsData, error: commentsError } =
					await supabaseClient.rpc("get_comments_by_perfume_id", {
						p_perfume_id: perfumeId,
					});

				console.log("Comments RPC response - Data:", commentsData);
				console.log("Comments RPC response - Error:", commentsError);

				if (commentsError) {
					console.error("Error fetching comments:", commentsError);
				} else {
					comments = commentsData || [];
					console.log("Comments fetched successfully:", comments);
				}
			} catch (err) {
				console.error("Comments fetch failed:", err);
			}

			// Update perfumeData with comments
			if (perfumeData) {
				perfumeData = { ...perfumeData, comments };
				console.log("Perfume data with comments:", perfumeData);

				// Update view count
				const today = new Date().toISOString().split("T")[0];
				console.log("Updating view count for date:", today);

				const { data: existingView, error: viewError } =
					await supabaseClient
						.from("perfume_views")
						.select("views_count")
						.match({
							perfume_id: perfumeId,
							view_date: today,
							source_table: "perfumes",
						})
						.single();

				console.log("Existing view data:", existingView);
				console.log("View fetch error:", viewError);

				if (viewError && viewError.code !== "PGRST116") {
					console.error("Error fetching view count:", viewError);
				}

				if (existingView) {
					console.log("Updating existing view count...");
					await supabaseClient
						.from("perfume_views")
						.update({ views_count: existingView.views_count + 1 })
						.match({
							perfume_id: perfumeId,
							view_date: today,
							source_table: "perfumes",
						});
					console.log(
						"View count updated to:",
						existingView.views_count + 1,
					);
				} else {
					console.log("Inserting new view count...");
					const { error } = await supabaseClient
						.from("perfume_views")
						.insert({
							perfume_id: perfumeId,
							view_date: today,
							views_count: 1,
							source_table: "perfumes",
						});
					console.log("View insert error:", error);
					console.log("New view count inserted");
				}
			}

			console.log("Final perfume data to return:", perfumeData);
			return { data: perfumeData, errorMessages: null };
		} catch (error: any) {
			console.error("Error in fetchPerfumeById:", error);
			return rejectWithValue(
				error.message || "Failed to fetch perfume data",
			);
		}
	},
);

export const fetchPerfumes = createAsyncThunk(
	"perfume/fetchPerfumes",
	async (
		{
			pageNumber,
			itemsPerPage,
		}: { pageNumber: number; itemsPerPage: number },
		{ rejectWithValue, getState },
	) => {
		// console.log("Fetching page number:", pageNumber);
		try {
			const state = getState() as { perfumes: PerfumeState };
			// console.log("Perfume state:", state.perfumes);
			if (state.perfumes.fetchedPerfumePages.includes(pageNumber)) {
				// console.log("Already fetched page number:", pageNumber);
				return [];
			}
			// console.log("Starting to fetch page number:", pageNumber);
			const { data, error } = await supabaseClient
				.rpc("get_perfumes_paginated", {
					page_number: pageNumber,
					items_per_page: itemsPerPage,
				})
				.select();
			// console.log("Supabase response:", { data, error });
			if (error) throw error;
			// console.log("data", data);
			return { data: data as Perfume[], page: pageNumber };
		} catch (error: any) {
			console.error("Error in fetchPerfumes:", error);
			return rejectWithValue(error.message);
		}
	},
);

// Fetch Tradable Perfumes with Pagination
export const fetchTradablePerfumes = createAsyncThunk(
	"perfume/fetchTradablePerfumes",
	async (
		{
			pageNumber,
			itemsPerPage,
		}: { pageNumber: number; itemsPerPage: number },
		{ rejectWithValue, getState },
	) => {
		// Access the current state
		const state = getState() as { perfumes: PerfumeState };

		// Skip fetching if the page has already been fetched
		if (state.perfumes.fetchedTradablePerfumePages.includes(pageNumber)) {
			return []; // Return empty array to indicate no new data
		}
		try {
			const { data, error } = await supabaseClient
				.rpc("get_tradable_perfumes_paginated", {
					page_number: pageNumber,
					items_per_page: itemsPerPage,
				})
				.select();
			if (error) throw error;
			return data as TradablePerfume[];
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

// Add Tradable Perfume
export const addTradablePerfume = createAsyncThunk(
	"perfume/addTradablePerfume",
	async (
		{
			perfumeData,
			userProfile,
		}: { perfumeData: TradablePerfumeForInsert; userProfile: Profile },
		{ rejectWithValue },
	) => {
		let uploadedImages = null;

		try {
			if (!userProfile) throw new Error("User profile not found");
			if (perfumeData.imagesFiles?.length) {
				uploadedImages = await uploadImagesToSupabase(
					"TradablePerfume",
					perfumeData.imagesFiles,
				);
				if (!uploadedImages?.uploadedFiles) {
					throw new Error("Image upload failed");
				}
				perfumeData.images = uploadedImages.uploadedFiles.map(
					(file) => file.publicUrl,
				);
			}
			const { imagePreviews, imagesFiles, ...perfumeDataToInsert } =
				perfumeData;
			const { data, error } = await supabaseClient
				.from("tradable_perfumes")
				.insert([
					{
						...perfumeDataToInsert,
						user_name: userProfile.name,
						user_id: userProfile.id,
						images: perfumeData.images ?? [],
					},
				])
				.select()
				.single();

			if (error) {
				if (uploadedImages) {
					await rollbackUploadedFiles(
						uploadedImages.uploadedFiles.map(
							(file) => file.filePath,
						),
					);
				}
				throw error;
			}

			return data as TradablePerfume;
		} catch (error: any) {
			console.error("Error adding tradable perfume:", error);
			if (uploadedImages) {
				await rollbackUploadedFiles(
					uploadedImages.uploadedFiles.map((file) => file.filePath),
				);
			}
			return rejectWithValue(error.message);
		}
	},
);

// Fetch Top 5 Views By Date
export const fetchTop5ViewsByDate = createAsyncThunk(
	"perfume/fetchTop5ViewsByDate",
	async (
		{
			date,
			sourceTable,
		}: { date: Date; sourceTable?: "perfumes" | "tradable_perfumes" },
		{ rejectWithValue },
	) => {
		try {
			const dateString = date.toISOString().split("T")[0];
			console.log("Date string:", dateString);
			const { data, error } = await supabaseClient
				.rpc("get_top_5_views_by_date", {
					target_date: dateString,
					target_source_table: sourceTable || null,
				})
				.select();
			if (error) throw error;
			return data.map(
				(item) => item.perfume_data as Perfume | TradablePerfume,
			);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

// Fetch Top 5 Views All Time
export const fetchTop5ViewsAllTime = createAsyncThunk(
	"perfume/fetchTop5ViewsAllTime",
	async (
		{ sourceTable }: { sourceTable?: "perfumes" | "tradable_perfumes" },
		{ rejectWithValue },
	) => {
		try {
			const { data, error } = await supabaseClient
				.rpc("get_top_5_views_all_time", {
					target_source_table: sourceTable || null,
				})
				.select();
			if (error) throw error;
			return data.map(
				(item) => item.perfume_data as Perfume | TradablePerfume,
			);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

const perfumeSlice = createSlice({
	name: "perfume",
	initialState,
	reducers: {
		setPerfumes: (state, action: PayloadAction<Perfume[]>) => {
			state.perfumes = action.payload;
		},
		addPerfumes: (state, action: PayloadAction<Perfume[]>) => {
			const newPerfumes = action.payload.filter(
				(perfume) => !state.perfumes.some((p) => p.id === perfume.id),
			);
			state.perfumes = [...state.perfumes, ...newPerfumes];
		},
		addTradablePerfumes: (
			state,
			action: PayloadAction<TradablePerfume[]>,
		) => {
			const newTradablePerfumes = action.payload.filter(
				(perfume) =>
					!state.tradablePerfumes.some((p) => p.id === perfume.id),
			);
			state.tradablePerfumes = [
				...state.tradablePerfumes,
				...newTradablePerfumes,
			];
		},
		removeTradablePerfume: (state, action: PayloadAction<string>) => {
			state.tradablePerfumes = state.tradablePerfumes.filter(
				(item) => item.id !== action.payload,
			);
		},
		// addComments: (state, action: PayloadAction<{ perfumeId: string; comment: string }>) => {
		// 	const perfume = state.perfumes.find((p) => p.id === action.payload.perfumeId);
		// 	if (perfume) {
		// 		perfume.comments.push({ text: action.payload.comment });
		// 	}
		// },
	},
	extraReducers: (builder) => {
		builder
			// fetchPerfumes
			.addCase(fetchPerfumes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPerfumes.fulfilled, (state, action) => {
				// If the payload is an empty array, this means we already fetched this page
				if (Array.isArray(action.payload)) {
					state.loading = false;
					return;
				}

				const newPerfumes = action.payload.data.filter(
					(perfume) =>
						!state.perfumes.some((p) => p.id === perfume.id),
				);
				state.perfumes = [...state.perfumes, ...newPerfumes];
				state.perfumes_by_page[action.payload.page] = newPerfumes;
				if (
					!state.fetchedPerfumePages.includes(
						action.meta.arg.pageNumber,
					)
				) {
					state.fetchedPerfumePages.push(action.meta.arg.pageNumber);
				}
				state.loading = false;
			})
			.addCase(fetchPerfumes.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			// fetchTradablePerfumes
			.addCase(fetchTradablePerfumes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTradablePerfumes.fulfilled, (state, action) => {
				const newTradablePerfumes = action.payload.filter(
					(perfume) =>
						!state.tradablePerfumes.some(
							(p) => p.id === perfume.id,
						),
				);
				state.tradablePerfumes = [
					...state.tradablePerfumes,
					...newTradablePerfumes,
				];

				// Only add pageNumber if it’s not already in the array
				if (
					!state.fetchedTradablePerfumePages.includes(
						action.meta.arg.pageNumber,
					)
				) {
					state.fetchedTradablePerfumePages.push(
						action.meta.arg.pageNumber,
					);
				}

				state.loading = false;
			})
			.addCase(fetchTradablePerfumes.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			// addTradablePerfume
			.addCase(addTradablePerfume.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addTradablePerfume.fulfilled, (state, action) => {
				state.tradablePerfumes = [
					action.payload,
					...state.tradablePerfumes,
				];
				state.loading = false;
			})
			.addCase(addTradablePerfume.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			// fetchTop5ViewsByDate
			.addCase(fetchTop5ViewsByDate.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTop5ViewsByDate.fulfilled, (state, action) => {
				state.most_views_by_date = action.payload;
				state.loading = false;
			})
			.addCase(fetchTop5ViewsByDate.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			// fetchTop5ViewsAllTime
			.addCase(fetchTop5ViewsAllTime.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTop5ViewsAllTime.fulfilled, (state, action) => {
				state.most_views_all_time = action.payload;
				state.loading = false;
			})
			.addCase(fetchTop5ViewsAllTime.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			// fetchPerfumeById
			.addCase(fetchPerfumeById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPerfumeById.fulfilled, (state, action) => {
				state.selectedPerfume = {
					data: action.payload.data || null,
					errorMessages: action.payload.errorMessages,
				};
				state.loading = false;
			})
			.addCase(fetchPerfumeById.rejected, (state, action) => {
				state.selectedPerfume.errorMessages = action.payload as string;
				state.loading = false;
			}) // Add these to your extraReducers
			.addCase(addComment.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addComment.fulfilled, (state, action) => {
				state.loading = false;

				// Add the new comment to the selected perfume if it exists
				if (state.selectedPerfume.data) {
					state.selectedPerfume.data.comments = [
						action.payload,
						...(state.selectedPerfume.data.comments || []),
					];
				}
			})
			.addCase(addComment.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(addReply.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addReply.fulfilled, (state, action) => {
				state.loading = false;

				// Add the new reply to the correct comment if the perfume is selected
				if (state.selectedPerfume.data) {
					state.selectedPerfume.data.comments =
						state.selectedPerfume.data.comments.map((comment) => {
							if (comment.id === action.payload.commentId) {
								return {
									...comment,
									replies: [
										...comment.replies,
										action.payload.reply,
									],
								};
							}
							return comment;
						});
				}
			})
			.addCase(addReply.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			}) // Add to your extraReducers in perfumeSlice
			.addCase(deleteComment.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteComment.fulfilled, (state, action) => {
				state.loading = false;

				// Remove the comment from the selected perfume if it exists
				if (state.selectedPerfume.data) {
					state.selectedPerfume.data.comments =
						state.selectedPerfume.data.comments.filter(
							(comment) =>
								comment.id !== action.payload.commentId,
						);
				}
			})
			.addCase(deleteComment.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(deleteReply.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteReply.fulfilled, (state, action) => {
				state.loading = false;

				// Remove the reply from the correct comment if the perfume is selected
				if (state.selectedPerfume.data) {
					state.selectedPerfume.data.comments =
						state.selectedPerfume.data.comments.map((comment) => {
							if (comment.id === action.payload.commentId) {
								return {
									...comment,
									replies: comment.replies.filter(
										(reply) =>
											reply.id !== action.payload.replyId,
									),
								};
							}
							return comment;
						});
				}
			})
			.addCase(deleteReply.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const {
	setPerfumes,
	addPerfumes,
	addTradablePerfumes,
	removeTradablePerfume,
} = perfumeSlice.actions;
export default perfumeSlice.reducer;
