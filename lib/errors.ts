import { isRedirectError } from "next/dist/client/components/redirect";
import { z } from "zod";

export class APIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends Error {
  public data: any;
  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }
}

export function getErrorMessage(err: unknown, fallbackMessage?: string) {
  const unknownError = fallbackMessage || null;

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof ValidationError) {
    return err.message;
  } else if (err instanceof APIError) {
    return err.message;
  } else if (err instanceof Error) {
    return err.message;
  } else if (isRedirectError(err)) {
    throw err;
  } else if (typeof err === "string") {
    return err;
  } else if (
    typeof err === "object" &&
    err != null &&
    "message" in err &&
    typeof err.message === "string"
  ) {
    return err.message;
  } else {
    return unknownError;
  }
}
