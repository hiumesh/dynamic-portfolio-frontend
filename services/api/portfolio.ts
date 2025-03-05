"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getAll({
  cursor,
  query,
}: {
  cursor?: string | number;
  query?: string;
}) {
  const queryParams = [];
  if (cursor) queryParams.push(`cursor=${cursor}`);
  if (query) queryParams.push(`query=${query}`);
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio?${queryParams.join("&")}`,
    { cache: "no-store" },
    { continueIfNotAuthenticated: true }
  );

  return processFetchResponse<{ list: PortfolioListItem[]; cursor: number }>(
    response
  );
}

export async function getBySlug(slug: string) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/${slug}`,
    {
      cache: "no-store",
    },
    { continueIfNotAuthenticated: true }
  );

  return processFetchResponse<Portfolio>(response);
}

export async function getSubDomainBySlug(
  slug: string,
  module:
    | "educations"
    | "work_experiences"
    | "certifications"
    | "hackathons"
    | "works"
) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/${slug}/${module}`,
    {
      cache: "no-store",
    },
    { continueIfNotAuthenticated: true }
  );

  return processFetchResponse<
    | UserEducations
    | UserWorkExperiences
    | UserCertifications
    | UserHackathons
    | WorkGalleryItems
  >(response);
}

export async function get() {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/user`, {
    cache: "no-store",
  });

  return processFetchResponse<Portfolio>(response);
}

export async function publish() {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/status/publish`, {
    cache: "no-store",
  });

  return processFetchResponse(response);
}

export async function takedown() {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/status/takedown`,
    {
      cache: "no-store",
    }
  );

  return processFetchResponse(response);
}

export async function updateSkills(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/skills`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });
  return processFetchResponse(response);
}
