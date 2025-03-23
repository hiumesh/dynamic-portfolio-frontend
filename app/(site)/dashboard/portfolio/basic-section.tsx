"use client";

import { Button } from "@/components/ui/button";
import { get } from "@/services/api/portfolio";
import { Chip, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Edit3, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import ProfileFormModal from "../edit-profile-modal";
import { useState } from "react";
import Link from "next/link";

export default function BasicSection() {
  const [form, setForm] = useState({
    visible: false,
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

  const basicDetails = data?.basic_details;

  if (error) return <></>;

  return (
    <section className="mx-4 border shadow rounded-md">
      <div className="flex items-center justify-between px-2 py-1 border-b">
        <h1 className="text-lg">Basic</h1>
        {isLoading || isRefetching ? (
          <Spinner size="sm" />
        ) : (
          <Button
            className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
            onClick={() => setForm({ visible: true })}
          >
            <Edit3 /> Edit
          </Button>
        )}
      </div>

      <div className="flex gap-3 p-2">
        <div className="space-y-4 flex-1">
          <div>
            <h4 className="text-gray-500 text-xs">Name</h4>
            <p className="text-sm">{basicDetails?.name}</p>
          </div>
          {basicDetails?.about ? (
            <div>
              <h4 className="text-gray-500 text-xs">About</h4>
              <p className="text-sm">{basicDetails?.about}</p>
            </div>
          ) : null}

          <div className="space-y-1">
            <h4 className="text-gray-500 text-xs">Work Domain</h4>
            <div className="flex items-center flex-wrap gap-2">
              {basicDetails?.work_domains?.map((wd) => (
                <Chip key={wd} variant="solid" color="secondary">
                  {wd}
                </Chip>
              ))}
            </div>
          </div>
          {basicDetails?.tagline ? (
            <div>
              <h4 className="text-gray-500 text-xs">Tagline</h4>
              <p className="text-sm">{basicDetails?.tagline}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-gray-500 text-xs">Collage</h4>
              <p className="text-sm">{basicDetails?.college}</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-xs">Graduation Year</h4>
              <p className="text-sm">{basicDetails?.graduation_year}</p>
            </div>
          </div>
          {basicDetails?.social_profiles &&
          basicDetails?.social_profiles?.length > 0 ? (
            <div className="space-y-1">
              <h4 className="text-gray-500 text-xs">Social Profiles</h4>
              <div className=" space-y-1">
                {basicDetails?.social_profiles?.map((sp) => (
                  <div
                    key={sp.url}
                    className="text-sm text-gray-700 hover:text-blue-500"
                  >
                    <Link href={sp.url} className="flex items-center gap-2">
                      {sp.platform}
                      <LinkIcon size={16} strokeWidth={1} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {basicDetails?.avatar ? (
          <div className="p-4 w-28 h-28 rounded-full bg-gray-100">
            <Image
              src={basicDetails?.avatar}
              alt="avatar"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
        ) : null}
      </div>
      <ProfileFormModal
        isOpen={form.visible}
        editData={{
          name: basicDetails?.name,
          about: basicDetails?.about,
          work_domains: basicDetails?.work_domains,
          tagline: basicDetails?.tagline,
          college: basicDetails?.college,
          graduation_year: basicDetails?.graduation_year,
          avatar: basicDetails?.avatar,
          social_profiles: basicDetails?.social_profiles,
        }}
        hide={() => setForm({ visible: false })}
        onSuccess={() => {
          refetch();
        }}
      />
    </section>
  );
}
