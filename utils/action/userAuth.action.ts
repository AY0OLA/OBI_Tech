"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { emailValidationSchema } from "../zodvalidations/form-validations";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;

  const emailValidation = emailValidationSchema.safeParse({ email });

  if (!emailValidation.success) {
    return {
      error: "Please enter a valid email address.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        avatar_url: null,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");

  return {
    error: null,
    user: data.user,
    needsEmailConfirmation: !data.session,
  };
}
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const emailValidation = emailValidationSchema.safeParse({ email });

  if (!emailValidation.success) {
    return {
      error: "Please enter a valid email address.",
      session: null,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
      session: null,
    };
  }

  revalidatePath("/");

  return {
    error: null,
    session: data.session,
  };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");

  return {
    error: null,
  };
}
