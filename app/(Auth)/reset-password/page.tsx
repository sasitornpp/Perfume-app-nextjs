/*************  ✨ Codeium Command 🌟  *************/
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z as zod } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Key } from "lucide-react";
import { supabaseClient } from "@/utils/supabase/client";

const resetPasswordSchema = zod
    .object({
        password: zod.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: zod
            .string()
            .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function ResetPasswordForm() {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // Check initial state immediately when the page loads

        const checkRecoveryMode = async () => {
            const {
                data: { session },
            } = await supabaseClient.auth.getSession();
            if (!session) {
                setMessage("Invalid or expired reset link");

                setTimeout(() => router.push("/login"), 2000);
                return;
            }
        };
        checkRecoveryMode();

        // Listen for auth state changes
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            (event, session) => {
                if (event === "PASSWORD_RECOVERY") {
                    setMessage("Please enter your new password");
                } else if (!session) {
                    setMessage("Invalid or expired reset link");

                    setTimeout(() => router.push("/login"), 2000);
                }
            },
        );

        // Cleanup subscription when component unmounts
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const result = resetPasswordSchema.parse({
                password,
                confirmPassword,
            });

            const { error } = await supabaseClient.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setIsSuccess(true);
            setMessage(
                "Password reset successful! Redirecting to login page...",
            );

            setTimeout(() => router.push("/sign-in"), 2000);
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
                setErrors({
                    error:
                        (error as any)?.message ||
                        "An error occurred while resetting the password",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
                                <Key className="h-6 w-6 text-primary" />
                                <h1 className="text-3xl font-bold text-card-foreground">
                                    Essence
                                </h1>
                            </motion.div>
                            <motion.h2
                                className="text-2xl font-semibold text-card-foreground"
                                variants={itemVariants}
                            >
                                Reset Password
                            </motion.h2>
                            <motion.p
                                className="text-balance text-sm text-muted-foreground"
                                variants={itemVariants}
                            >
                                Please set a new password to access your perfume
                                profile
                            </motion.p>
                        </motion.div>

                        {message && (
                            <motion.div
                                className={`p-3 rounded-md ${
                                    isSuccess
                                        ? "bg-green-500/10 border border-green-500/20 text-green-600"
                                        : message.includes("Invalid")
                                            ? "bg-destructive/10 border border-destructive/20 text-destructive"
                                            : "bg-blue-500/10 border border-blue-500/20 text-blue-600"
                                } text-sm text-center`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring" }}
                            >
                                {message}
                            </motion.div>
                        )}

                        <motion.div
                            className="grid gap-6"
                            variants={containerVariants}
                        >
                            <motion.div
                                className="grid gap-2"
                                variants={itemVariants}
                            >
                                <Label
                                    htmlFor="password"
                                    className="text-card-foreground"
                                >
                                    New Password
                                </Label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Enter new password"
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
                            </motion.div>

                            <motion.div
                                className="grid gap-2"
                                variants={itemVariants}
                            >
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-card-foreground"
                                >
                                    Confirm New Password
                                </Label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className={cn(
                                        "border-accent/20 bg-card transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
                                        errors.confirmPassword &&
                                            "border-destructive focus:border-destructive",
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <motion.span
                                        className="text-destructive text-sm"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                    >
                                        {errors.confirmPassword}
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
                                    disabled={isSubmitting || isSuccess}
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100"
                                        variants={shimmerEffect}
                                        initial="hidden"
                                        animate="visible"
                                    />
                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save New Password"}
                                </Button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="text-center text-sm text-card-foreground"
                            variants={itemVariants}
                        >
                            Remember password?{" "}
                            <Link
                                className="text-primary font-medium hover:underline transition-all"
                                href="/sign-in"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    </motion.form>
                </motion.div>
            </motion.div>
        </div>
    );
}
