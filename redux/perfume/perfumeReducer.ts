import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
	Perfume,
	PerfumeForInsert,
	PerfumeMostViews,
	PerfumeUniqueData,
} from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
import { Profile } from "@/types/profile";
import {
	uploadImagesToSupabase,
	rollbackUploadedFiles,
} from "@/utils/functions/image_process";
import { Comments, Reply, Filters } from "@/types/perfume";
import {
	addNewTotalPage,
	clearPerfumesPage,
} from "@/redux/pagination/paginationReducer";

// Update the PerfumeState interface to include currentFilters
interface PerfumeState {
	perfumes_filters_by_page: {
		[page: number]: Perfume[];
	};
	perfumes_by_page: {
		[page: number]: Perfume[];
	};
	selectedPerfume: { data: Perfume | null; errorMessages: string | null };
	most_views_by_date: PerfumeMostViews[];
	most_views_all_time: PerfumeMostViews[];
	loading: boolean;
	error: string | null;
	fetchedPerfumePages: number[];
	fetchedFilteredPages: number[];
	perfume_unique_data: PerfumeUniqueData;
	currentFilters: Filters | null;
	totalFilteredCount: number;
}

const initialState: PerfumeState = {
	perfumes_filters_by_page: {},
	perfumes_by_page: {},
	selectedPerfume: { data: null, errorMessages: null },
	most_views_by_date: [],
	most_views_all_time: [],
	loading: false,
	error: null,
	fetchedPerfumePages: [],
	fetchedFilteredPages: [],
	perfume_unique_data: {
		brand: [],
		perfumer: [],
		accords: [],
		top_notes: [],
		middle_notes: [],
		base_notes: [],
	},
	currentFilters: null,
	totalFilteredCount: 0,
};

// Replace the existing toggleLikeComment function
export const toggleLikeComment = createAsyncThunk(
	"perfume/toggleLikeComment",
	async (
		{ commentId, userId }: { commentId: string; userId: string },
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to like a comment");
			}

			// Get the current comment data
			const { data: comment, error: fetchError } = await supabaseClient
				.from("comments")
				.select("likes")
				.eq("id", commentId)
				.single();

			if (fetchError) throw fetchError;

			// Check if user already liked the comment
			const likes: string[] = comment.likes || [];
			const userIndex = likes.indexOf(userId);

			// Toggle like status
			let updatedLikes: string[];
			if (userIndex !== -1) {
				// User already liked, so unlike
				updatedLikes = [...likes];
				updatedLikes.splice(userIndex, 1);
			} else {
				// User hasn't liked, so add like
				updatedLikes = [...likes, userId];
			}

			// Update the comment with new likes array
			const { error: updateError } = await supabaseClient
				.from("comments")
				.update({ likes: updatedLikes })
				.eq("id", commentId);

			if (updateError) throw updateError;

			return {
				commentId,
				likes: updatedLikes,
				userId,
			};
		} catch (error: any) {
			return rejectWithValue(
				error.message || "Failed to toggle like on comment",
			);
		}
	},
);

export const toggleLikeReply = createAsyncThunk(
	"perfume/toggleLikeReply",
	async (
		{ replyId, userId }: { replyId: string; userId: string },
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to like a reply");
			}

			// Get the current reply data
			const { data: reply, error: fetchError } = await supabaseClient
				.from("reply")
				.select("likes, comments_id")
				.eq("id", replyId)
				.single();

			if (fetchError) throw fetchError;

			// Check if user already liked the reply
			const likes: string[] = reply.likes || [];
			const commentId = reply.comments_id;
			const userIndex = likes.indexOf(userId);

			// Toggle like status
			let updatedLikes: string[];
			if (userIndex !== -1) {
				// User already liked, so unlike
				updatedLikes = [...likes];
				updatedLikes.splice(userIndex, 1);
			} else {
				// User hasn't liked, so add like
				updatedLikes = [...likes, userId];
			}

			// Update the reply with new likes array
			const { error: updateError } = await supabaseClient
				.from("reply")
				.update({ likes: updatedLikes })
				.eq("id", replyId);

			if (updateError) throw updateError;

			return {
				replyId,
				commentId,
				likes: updatedLikes,
				userId,
			};
		} catch (error: any) {
			return rejectWithValue(
				error.message || "Failed to toggle like on reply",
			);
		}
	},
);

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
				.select("user")
				.eq("id", commentId)
				.single();

			if (fetchError) throw fetchError;

			// Check if user is authorized (owns the comment)
			if (comment.user !== user.id) {
				throw new Error(
					"You don't have permission to delete this comment",
				);
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
				.select("user")
				.eq("id", replyId)
				.single();

			if (fetchError) throw fetchError;

			// Check if user is authorized (owns the reply)
			if (reply.user !== user.id) {
				throw new Error(
					"You don't have permission to delete this reply",
				);
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

export const addComment = createAsyncThunk(
	"perfume/addComment",
	async (
		{
			perfumeId,
			text,
		}: {
			perfumeId: string;
			text: string;
		},
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to comment");
			}

			// Insert the comment into the database
			const { data: newComment, error } = await supabaseClient
				.from("comments")
				.insert({
					perfumes_id: perfumeId,
					user: user.id,
					text,
					images: [],
					likes: [],
				})
				.select()
				.single();

			if (error) {
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

export const addReply = createAsyncThunk(
	"perfume/addReply",
	async (
		{
			commentId,
			text,
		}: {
			commentId: string;
			text: string;
		},
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: { profile: Profile } };
			const user = state.user.profile;

			if (!user || !user.id) {
				throw new Error("User must be logged in to reply");
			}

			// Insert the reply into the database
			const { data: newReply, error } = await supabaseClient
				.from("reply")
				.insert({
					comments_id: commentId,
					user: user.id,
					text,
					images: [],
					likes: [],
				})
				.select()
				.single();

			if (error) {
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

export const addPerfume = createAsyncThunk(
	"perfume/addPerfume",
	async (
		{
			perfumeData,
			userProfile,
		}: { perfumeData: PerfumeForInsert; userProfile: Profile },
		{ rejectWithValue },
	) => {
		let uploadedImages = null;

		try {
			if (!userProfile) throw new Error("User profile not found");
			if (perfumeData.imagesFiles?.length) {
				uploadedImages = await uploadImagesToSupabase(
					"Perfume", // Changed from TradablePerfume
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
				.from("perfumes") // Changed from tradable_perfumes
				.insert([
					{
						...perfumeDataToInsert,
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

			return data as Perfume;
		} catch (error: any) {
			console.error("Error adding perfume:", error);
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
	async ({ date }: { date: Date }, { rejectWithValue }) => {
		try {
			const dateString = date.toISOString().split("T")[0];
			// console.log("Date string:", dateString);
			const { data, error } = await supabaseClient
				.rpc("get_top_5_views_by_date", {
					target_date: dateString,
				})
				.select();
			if (error) throw error;
			return data as PerfumeMostViews[];
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

// Fetch Top 5 Views All Time
export const fetchTop3ViewsAllTime = createAsyncThunk(
	"perfume/fetchTop5ViewsAllTime",
	async (_, { rejectWithValue }) => {
		try {
			const { data, error } = await supabaseClient
				.rpc("get_top_3_views_all_time")
				.select();
			if (error) throw error;
			return data.map((item) => item.perfume_data as PerfumeMostViews);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const fetchUniqueData = createAsyncThunk(
	"perfume/fetchUniqueData",
	async (_, { rejectWithValue }) => {
		try {
			const { data, error } = await supabaseClient
				.rpc("fetch_unique_perfume_data")
				.select();
			if (error) throw error;
			return data as unknown as PerfumeUniqueData;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const toggleLikePerfume = createAsyncThunk(
	"perfume/toggleLikePerfume",
	async (
		{ perfumeId, userId }: { perfumeId: string; userId: string },
		{ rejectWithValue },
	) => {
		try {
			console.log("perfumeId", perfumeId);
			console.log("userId", userId);
			const { error } = await supabaseClient.rpc("toggle_perfume_like", {
				p_user_id: perfumeId,
				p_perfume_id: userId,
			});
			if (error) throw error;
			return { perfumeId, userId };
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

const perfumeSlice = createSlice({
	name: "perfume",
	initialState,
	reducers: {},
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

				state.perfumes_by_page[action.payload.page] =
					action.payload.data;
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
			.addCase(fetchTop3ViewsAllTime.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTop3ViewsAllTime.fulfilled, (state, action) => {
				state.most_views_all_time = action.payload;
				state.loading = false;
			})
			.addCase(fetchTop3ViewsAllTime.rejected, (state, action) => {
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
			})
			// In your extraReducers section, replace the current comment/reply handlers with these:

			// Add comment
			.addCase(addComment.pending, (state) => {
				state.loading = true; // Set loading to true
				state.error = null;
			})
			.addCase(addComment.fulfilled, (state, action) => {
				state.loading = false; // Set loading to false
				// Add the new comment to the selected perfume if it exists
				if (state.selectedPerfume.data) {
					state.selectedPerfume.data.comments = [
						action.payload,
						...(state.selectedPerfume.data.comments || []),
					];
				}
			})
			.addCase(addComment.rejected, (state, action) => {
				state.loading = false; // Set loading to false on error
				state.error = action.payload as string;
			})

			// Add reply
			.addCase(addReply.pending, (state) => {
				state.loading = true; // Set loading to true
				state.error = null;
			})
			.addCase(addReply.fulfilled, (state, action) => {
				state.loading = false; // Set loading to false
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
				state.loading = false; // Set loading to false on error
				state.error = action.payload as string;
			})

			// Delete comment
			.addCase(deleteComment.pending, (state) => {
				state.loading = true; // Set loading to true
				state.error = null;
			})
			.addCase(deleteComment.fulfilled, (state, action) => {
				state.loading = false; // Set loading to false
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
				state.loading = false; // Set loading to false on error
				state.error = action.payload as string;
			})

			// Delete reply
			.addCase(deleteReply.pending, (state) => {
				state.loading = true; // Set loading to true
				state.error = null;
			})
			.addCase(deleteReply.fulfilled, (state, action) => {
				state.loading = false; // Set loading to false
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
				state.loading = false; // Set loading to false on error
				state.error = action.payload as string;
			})

			// Toggle like comment
			.addCase(toggleLikeComment.pending, (state) => {
				state.loading = true; // Set loading to true
				state.error = null;
			})
			.addCase(toggleLikeComment.fulfilled, (state, action) => {
				state.loading = false; // Set loading to false
				// Update the likes array for the specified comment
				if (state.selectedPerfume.data) {
					state.selectedPerfume.data.comments =
						state.selectedPerfume.data.comments.map((comment) => {
							if (comment.id === action.payload.commentId) {
								return {
									...comment,
									likes: action.payload.likes,
								};
							}
							return comment;
						});
				}
			})
			.addCase(toggleLikeComment.rejected, (state, action) => {
				state.loading = false; // Set loading to false on error
				state.error = action.payload as string;
			})

			// Toggle like reply
			.addCase(toggleLikeReply.pending, (state) => {
				state.loading = true; // Set loading to true
				state.error = null;
			})
			.addCase(toggleLikeReply.fulfilled, (state, action) => {
				state.loading = false; // Set loading to false
				// Update the likes array for the specified reply
				if (state.selectedPerfume.data) {
					state.selectedPerfume.data.comments =
						state.selectedPerfume.data.comments.map((comment) => {
							if (comment.id === action.payload.commentId) {
								return {
									...comment,
									replies: comment.replies.map((reply) => {
										if (
											reply.id === action.payload.replyId
										) {
											return {
												...reply,
												likes: action.payload.likes,
											};
										}
										return reply;
									}),
								};
							}
							return comment;
						});
				}
			})
			.addCase(toggleLikeReply.rejected, (state, action) => {
				state.loading = false; // Set loading to false on error
				state.error = action.payload as string;
			})
			.addCase(fetchUniqueData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUniqueData.fulfilled, (state, action) => {
				state.perfume_unique_data = action.payload;
				state.loading = false;
			})
			.addCase(fetchUniqueData.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			.addCase(toggleLikePerfume.pending, (state) => {
				state.error = null;
			})
			.addCase(toggleLikePerfume.fulfilled, (state, action) => {
				if (
					state.selectedPerfume.data &&
					state.selectedPerfume.data.id === action.payload.perfumeId
				) {
					const likes = [...(state.selectedPerfume.data.likes || [])];
					const userIndex = likes.indexOf(action.payload.userId);

					if (userIndex !== -1) {
						// User already liked, so remove the like
						likes.splice(userIndex, 1);
					} else {
						// User hasn't liked, so add like
						likes.push(action.payload.userId);
					}

					state.selectedPerfume.data = {
						...state.selectedPerfume.data,
						likes,
					};
				}

				// Update likes in perfumes_by_page
				Object.keys(state.perfumes_by_page).forEach((page) => {
					state.perfumes_by_page[Number(page)] =
						state.perfumes_by_page[Number(page)].map((perfume) => {
							if (perfume.id === action.payload.perfumeId) {
								const likes = [...(perfume.likes || [])];
								const userIndex = likes.indexOf(
									action.payload.userId,
								);

								if (userIndex !== -1) {
									likes.splice(userIndex, 1);
								} else {
									likes.push(action.payload.userId);
								}

								return { ...perfume, likes };
							}
							return perfume;
						});
				});
			})
			.addCase(toggleLikePerfume.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const {} = perfumeSlice.actions;
export default perfumeSlice.reducer;
