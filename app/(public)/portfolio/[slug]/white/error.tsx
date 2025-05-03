"use client";

import { Button } from "@heroui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="p-10 min-h-screen flex items-center flex-col gap-5 justify-center">
      <div className="text-center">
        <h2 className="text-xl">Something went wrong!</h2>
        <p className="text-red-500 max-w-lg">{error.message}</p>
      </div>

      <Button onPress={() => reset()} color="primary">
        Try again
      </Button>
    </section>
  );
}
