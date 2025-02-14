"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signUpAction } from "@/utils/api/actions-client/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { z } from "zod";

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    retypePassword: z.string(),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords don't match",
    path: ["retypePassword"],
  });

function SignUpFrom() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [retypePassword, setRetypePassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = signUpSchema.parse({
        email,
        password,
        retypePassword,
      });

      signUpAction({
        email: result.email,
        password: result.password,
        router: router,
      });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {} as { [key: string]: string }
        );
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form
        className={cn("flex flex-col gap-6")}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="retypePassword">Retype Password</Label>
            <Input
              type="password"
              name="retypePassword"
              placeholder="Retype your password"
              required
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
            {errors.retypePassword && (
              <span className="text-red-500 text-sm">
                {errors.retypePassword}
              </span>
            )}
            {errors.error && (
              <span className="text-red-500 text-sm">{errors.error}</span>
            )}
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUpFrom;