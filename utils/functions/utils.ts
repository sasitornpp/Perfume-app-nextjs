import { redirect } from "next/navigation";
import { Perfume } from "@/types/perfume";

export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(
    `${path}?${type}=${encodeURIComponent(message)}`
  );
}

