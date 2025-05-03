"use client";

import { getErrorMessage } from "./errors";
import { addToast } from "@heroui/react";

export function showErrorToast(err: unknown, fallbackMessage?: string) {
  const errorMessage = getErrorMessage(err);
  addToast({
    title: "Something Went Wrong!",
    description: errorMessage || fallbackMessage || "Something went wrong",
    color: "danger",
  });
}
