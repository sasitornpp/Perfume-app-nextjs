"use client";

import React, { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { signInUser } from "@/redux/user/userReducer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z as zod } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";

const signInSchema = zod.object({
	email: zod.string().email("Invalid email address"),
	password: zod.string().min(6, "Password must be at least 6 characters"),
});

export default function SignInForm() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors({});

		try {
			const result = signInSchema.parse({ email, password });
			try {
				await dispatch(
					signInUser({
						email: result.email,
						password: result.password,
						router,
					}),
				);
			} catch (signInError) {
				setErrors({
					error:
						typeof signInError === "string"
							? signInError
							: (signInError as any)?.error ||
								"Authentication failed",
				});
			}
		} catch (error) {
			if (error instanceof zod.ZodError) {
				const formattedErrors = error.errors.reduce(
					(acc, curr) => {
						acc[curr.path[0]] = curr.message;
						return acc;
					},
					{} as { [key: string]: string },
				);
				setErrors(formattedErrors);
			} else {
				setErrors({ error: "An unexpected error occurred" });
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 100 },
		},
	};

	const shimmerEffect = {
		hidden: { backgroundPosition: "200% 0" },
		visible: {
			backgroundPosition: "0% 0",
			transition: { repeat: Infinity, duration: 3, ease: "linear" },
		},
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-background p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<motion.div
					className={cn(
						"relative overflow-hidden rounded-xl border border-accent/20 bg-card p-8 shadow-lg backdrop-blur-sm",
					)}
					initial={{ borderRadius: "20%" }}
					animate={{ borderRadius: "24px" }}
					transition={{ duration: 1.2, ease: "easeOut" }}
				>
					{/* Perfume bottle decorative element */}
					<motion.div
						className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.4, 0.7, 0.4],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>

					<motion.div
						className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-secondary/20 blur-3xl"
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{
							duration: 7,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 1,
						}}
					/>

					<motion.form
						className={cn("relative z-10 flex flex-col gap-6")}
						onSubmit={handleSubmit}
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						<motion.div
							className="flex flex-col items-center gap-2 text-center"
							variants={itemVariants}
						>
							<motion.div
								className="flex items-center gap-2 mb-2"
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2, type: "spring" }}
							>
								<Sparkles className="h-6 w-6 text-primary" />
								<h1 className="text-3xl font-bold text-card-foreground">
									Essence
								</h1>
							</motion.div>

							<motion.h2
								className="text-2xl font-semibold text-card-foreground"
								variants={itemVariants}
							>
								Welcome Back
							</motion.h2>

							<motion.p
								className="text-balance text-sm text-muted-foreground"
								variants={itemVariants}
							>
								Enter your details to access your fragrance
								profile
							</motion.p>
						</motion.div>

						<motion.div
							className="grid gap-6"
							variants={containerVariants}
						>
							<motion.div
								className="grid gap-2"
								variants={itemVariants}
							>
								<Label
									htmlFor="email"
									className="text-card-foreground"
								>
									Email
								</Label>
								<Input
									name="email"
									placeholder="you@example.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={cn(
										"border-accent/20 bg-card transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
										errors.email &&
											"border-destructive focus:border-destructive",
									)}
								/>
								{errors.email && (
									<motion.span
										className="text-destructive text-sm"
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
									>
										{errors.email}
									</motion.span>
								)}
							</motion.div>

							<motion.div
								className="grid gap-2"
								variants={itemVariants}
							>
								<div className="flex items-center justify-between">
									<Label
										htmlFor="password"
										className="text-card-foreground"
									>
										Password
									</Label>
									<Link
										className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
										href="/forgot-password"
									>
										Forgot Password?
									</Link>
								</div>
								<Input
									type="password"
									name="password"
									placeholder="Your password"
									required
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className={cn(
										"border-accent/20 bg-card transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
										errors.password &&
											"border-destructive focus:border-destructive",
									)}
								/>
								{errors.password && (
									<motion.span
										className="text-destructive text-sm"
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
									>
										{errors.password}
									</motion.span>
								)}
								{errors.error && (
									<motion.div
										className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ type: "spring" }}
									>
										{errors.error}
									</motion.div>
								)}
							</motion.div>

							<motion.div variants={itemVariants}>
								<Button
									type="submit"
									className="w-full relative overflow-hidden group"
									disabled={isSubmitting}
								>
									<motion.span
										className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100"
										variants={shimmerEffect}
										initial="hidden"
										animate="visible"
									/>
									{isSubmitting ? "Signing in..." : "Sign in"}
								</Button>
							</motion.div>

							<motion.div
								className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
								variants={itemVariants}
							>
								<span className="relative z-10 bg-card px-2 text-muted-foreground">
									Or continue with
								</span>
							</motion.div>
						</motion.div>

						<motion.div
							className="text-center text-sm text-card-foreground"
							variants={itemVariants}
						>
							Don&apos;t have an account?{" "}
							<Link
								className="text-primary font-medium hover:underline transition-all"
								href="/sign-up"
							>
								Create account
							</Link>
						</motion.div>
					</motion.form>
				</motion.div>
			</motion.div>
		</div>
	);
}
