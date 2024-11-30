"use client";

import { toast } from "sonner";
import { getErrorMessage } from "./errors";

export function showErrorToast(err: unknown, fallbackMessage?: string) {
  const errorMessage = getErrorMessage(err);
  return toast.error(
    errorMessage || fallbackMessage || "Something went wrong!"
  );
}
