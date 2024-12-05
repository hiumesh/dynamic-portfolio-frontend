"use client"; // Error boundaries must be Client Components

import { showErrorToast } from "@/lib/client-utils";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    showErrorToast(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
