"use client";

import { BlogMetaDataFormModal } from "@/components/metadata-forms/blog-metadata-form-modal";
import { CertificationMetaDataFormModal } from "@/components/metadata-forms/certification-metadata-form-modal";
import { EducationMetaDataFormModal } from "@/components/metadata-forms/education-metadata-form-modal";
import { WorkExperienceMetaDataFormModal } from "@/components/metadata-forms/experience-metadata-form-modal";
import { HackathonMetaDataFormModal } from "@/components/metadata-forms/hackathon-metadata-form-modal";
import { WorkGalleryMetaDataFormModal } from "@/components/metadata-forms/work-gallery-metadata-form-modal";
import { Button } from "@/components/ui/button";
import { get } from "@/services/api/portfolio";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Edit3 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdditionalSection() {
  const [form, setForm] = useState<{ name?: string }>({
    name: undefined,
  });
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["users_portfolio"],
    queryFn: async () => {
      const response = await get();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });

  const additionalDetails = data?.additional_details;

  if (error) return <></>;
  return (
    <section className="mx-4 border shadow rounded-md">
      <div className="flex items-center justify-between px-2 py-1 border-b">
        <h1 className="text-lg">Additional Details</h1>
        {isLoading || isRefetching ? <Spinner size="sm" /> : null}
      </div>
      <div className="grid grid-cols-3 gap-2 p-2">
        <div className="p-3 rounded-md bg-secondary-50  space-y-3 min-w-64">
          <div>
            <h3 className="text-lg text-gray-800">Educations</h3>
            <p className="text-xs text-gray-500">
              {additionalDetails?.education_metadata?.count || 0} Educations
              added so far
            </p>
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
              onClick={() => setForm({ name: "education" })}
            >
              <Edit3 /> Edit Meta
            </Button>
            <Link
              href="/dashboard/educations"
              className="flex items-center text-sm text-secondary-800"
            >
              Update <ArrowUpRight strokeWidth={1} size={18} />
            </Link>
          </div>
          <EducationMetaDataFormModal
            isOpen={form.name === "education"}
            hide={() => setForm({ name: undefined })}
            onSuccess={() => refetch()}
          />
        </div>

        <div className="p-3 rounded-md bg-secondary-50  space-y-3 min-w-64">
          <div>
            <h3 className="text-lg text-gray-800">Work Experience</h3>
            <p className="text-xs text-gray-500">
              {additionalDetails?.work_experience_metadata?.count || 0} Work
              experience added so far
            </p>
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
              onClick={() => setForm({ name: "work_experience" })}
            >
              <Edit3 /> Edit Meta
            </Button>
            <Link
              href="/dashboard/experiences"
              className="flex items-center text-sm text-secondary-800"
            >
              Update <ArrowUpRight strokeWidth={1} size={18} />
            </Link>
          </div>
          <WorkExperienceMetaDataFormModal
            isOpen={form.name === "work_experience"}
            hide={() => setForm({ name: undefined })}
            onSuccess={() => refetch()}
          />
        </div>
        <div className="p-3 rounded-md bg-secondary-50  space-y-3 min-w-64">
          <div>
            <h3 className="text-lg text-gray-800">Hackathons</h3>
            <p className="text-xs text-gray-500">
              {additionalDetails?.hackathon_metadata?.count || 0} Hackathons
              added so far
            </p>
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
              onClick={() => setForm({ name: "hackathon" })}
            >
              <Edit3 /> Edit Meta
            </Button>
            <Link
              href="/dashboard/hackathons"
              className="flex items-center text-sm text-secondary-800"
            >
              Update <ArrowUpRight strokeWidth={1} size={18} />
            </Link>
          </div>
          <HackathonMetaDataFormModal
            isOpen={form.name === "hackathon"}
            hide={() => setForm({ name: undefined })}
            onSuccess={() => refetch()}
          />
        </div>
        <div className="p-3 rounded-md bg-secondary-50  space-y-3 min-w-64">
          <div>
            <h3 className="text-lg text-gray-800">Certifications</h3>
            <p className="text-xs text-gray-500">
              {additionalDetails?.certification_metadata?.count || 0}&nbsp;
              Certification added so far
            </p>
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
              onClick={() => setForm({ name: "certification" })}
            >
              <Edit3 /> Edit Meta
            </Button>
            <Link
              href="/dashboard/certifications"
              className="flex items-center text-sm text-secondary-800"
            >
              Update <ArrowUpRight strokeWidth={1} size={18} />
            </Link>
          </div>
          <CertificationMetaDataFormModal
            isOpen={form.name === "certification"}
            hide={() => {
              setForm({ name: undefined });
            }}
            onSuccess={() => refetch()}
          />
        </div>

        <div className="p-3 rounded-md bg-secondary-50  space-y-3 min-w-64">
          <div>
            <h3 className="text-lg text-gray-800">Work Gallery</h3>
            <p className="text-xs text-gray-500">
              {additionalDetails?.work_gallery_metadata?.count || 0}&nbsp; Works
              added so far
            </p>
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
              onClick={() => setForm({ name: "work_gallery" })}
            >
              <Edit3 /> Edit Meta
            </Button>
            <Link
              href="/dashboard/work-gallery"
              className="flex items-center text-sm text-secondary-800"
            >
              Update <ArrowUpRight strokeWidth={1} size={18} />
            </Link>
          </div>
          <WorkGalleryMetaDataFormModal
            isOpen={form.name === "work_gallery"}
            hide={() => {
              setForm({ name: undefined });
            }}
            onSuccess={() => refetch()}
          />
        </div>
        <div className="p-3 rounded-md bg-secondary-50  space-y-3 min-w-64">
          <div>
            <h3 className="text-lg text-gray-800">Blogs</h3>
            <p className="text-xs text-gray-500">
              {additionalDetails?.blog_metadata?.count || 0}&nbsp; Blogs added
              so far
            </p>
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
              onClick={() => setForm({ name: "blogs" })}
            >
              <Edit3 /> Edit Meta
            </Button>
            <Link
              href="/dashboard/blogs  "
              className="flex items-center text-sm text-secondary-800"
            >
              Update <ArrowUpRight strokeWidth={1} size={18} />
            </Link>
          </div>
          <BlogMetaDataFormModal
            isOpen={form.name === "blogs"}
            hide={() => {
              setForm({ name: undefined });
            }}
            onSuccess={() => refetch()}
          />
        </div>
      </div>
    </section>
  );
}
