"use client";

import { getDetailBySlug } from "@/services/api/blog";
import { useQuery } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Body() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["blog", params.slug],
    queryFn: async () => {
      const response = await getDetailBySlug(params.slug);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  if (!data || error || isLoading) return null;

  return (
    <div>
      {data.cover_image ? (
        <div className="relative w-full min-h-[400px]">
          <Image
            src={data.cover_image}
            alt="image"
            fill
            className="absolute object-cover"
          />
        </div>
      ) : null}
      <MDEditor.Markdown source={data.body} />
    </div>
  );
}
