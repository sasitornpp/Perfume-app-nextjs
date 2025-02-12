"use client";

import { supabaseClient } from "@/utils/supabase/client";
import { type useRouter } from "next/navigation";

export async function signInAction({
  email,
  password,
  router,
}: {
  email: string;
  password: string;
  router: ReturnType<typeof useRouter>;
}) {
  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }
  router.push("/survey-form");
}

export async function signUpAction({
  email,
  password,
  router,
}: {
  email: string;
  password: string;
  router: ReturnType<typeof useRouter>;
}) {
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    return { error: error.message };
  }
  router.push("/survey-form");
}

export async function signOutAction({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  router.push("/");
}
