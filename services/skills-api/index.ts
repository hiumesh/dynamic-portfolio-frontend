"use server";

const SKILLS_API_KEY = process.env.SKILLS_API_KEY ?? "";

export async function getSkills({
  q,
  signal,
}: {
  q?: string;
  signal?: AbortSignal;
}) {
  if (!q) return [];

  const res = await fetch(`https://api.apilayer.com/skills?q=${q}`, {
    headers: {
      apikey: SKILLS_API_KEY,
    },
    signal,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return JSON.parse(await res.text()) as string[];
}
