import React from "react";
import { signUpAction } from "@/utils/api/actions-server";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Signup({
  searchParams,
}: Readonly<{ searchParams: Message }>) {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/home");
  }

  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <Label htmlFor="password1">Password</Label>
        <Input
          type="password"
          name="password1"
          placeholder="Your password"
          minLength={6}
          required
        />
        <Input
          type="password"
          name="password2"
          placeholder="Retype your password"
          minLength={6}
          required
        />
        <SubmitButton formAction={signUpAction} pendingText="Signing up...">
          Sign up
        </SubmitButton>
        <FormMessage message={await searchParams} />
      </div>
    </form>
  );
}
