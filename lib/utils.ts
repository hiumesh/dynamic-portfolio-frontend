import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserDisplayName({
  username,
  firstName,
  lastName,
}: {
  username: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
}) {
  if (firstName) return `${firstName}${lastName ? ` ${lastName}` : ""}`;
  return username ?? "error";
}

const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}
