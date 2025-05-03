"use client";

import { Button } from "@/components/ui/button";
import {
  get,
  updateProfileAttachment,
  upsertResume,
} from "@/services/api/portfolio";
import { Chip, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Edit3, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import ProfileFormModal from "../edit-profile-modal";
import { useState } from "react";
import Link from "next/link";
import { FileProxy, FileUploader } from "@/components/upload/file-uploader";
import { showErrorToast } from "@/lib/client-utils";

export default function BasicSection() {
  const [form, setForm] = useState({
    visible: false,
  });
  const [attachments, setAttachments] = useState<
    Record<string, FileProxy | undefined>
  >({});
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["users_portfolio", "basic_details"],
    queryFn: async () => {
      const response = await get();
      if (response.error) {
        throw new Error(response.error.message);
      }
      const data = response.data;
      setAttachments((p) => ({
        resume: data?.basic_details.resume
          ? {
              name: "Your Resume",
              type: "application/pdf",
              size: 0,
              url: data?.basic_details.resume,
            }
          : undefined,
        hero_image: data?.basic_details.hero_image
          ? {
              name: "Hero Image",
              type: "image/jpeg",
              size: 0,
              url: data?.basic_details.hero_image,
            }
          : undefined,
        about_image: data?.basic_details.about_image
          ? {
              name: "About Image",
              type: "image/jpeg",
              size: 0,
              url: data?.basic_details.about_image,
            }
          : undefined,
      }));
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleResumeUpload = async (
    module: "resume" | "about_image" | "hero_image",
    file?: FileProxy
  ) => {
    const oldFile = attachments[module];
    try {
      if (file) {
        setAttachments((prev) => ({
          ...prev,
          [module]: {
            ...file,
            name: "Your Resume",
            type: "application/pdf",
          },
        }));
      } else setAttachments((prev) => ({ ...prev, [module]: undefined }));
      if (
        file?.status === "success" ||
        (file === undefined && file != oldFile)
      ) {
        const { error } = await updateProfileAttachment(module, file?.url);
        if (error) {
          showErrorToast(error);
          setAttachments((prev) => ({
            ...prev,
            [module]: oldFile,
          }));
        }
      }
    } catch (error) {
      showErrorToast(oldFile);
      setAttachments((prev) => ({
        ...prev,
        [module]: oldFile,
      }));
    }
  };

  const basicDetails = data?.basic_details;

  if (error) return <></>;

  return (
    <section className="mx-4 border shadow rounded-md">
      <div className="flex items-center justify-between px-2 py-1 border-b">
        <h1 className="text-lg">Basic</h1>
        <div className="flex items-center gap-2">
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

          <div className="flex items-start gap-3">
            <div>
              <h4 className="text-gray-500 text-base">Resume</h4>
              <FileUploader
                variant="tile"
                multiple={false}
                value={attachments.resume ? [attachments.resume] : []}
                onValueChange={(file) => {
                  handleResumeUpload("resume", file?.at(0));
                }}
                accept={{
                  "application/pdf": [],
                }}
                maxFileCount={1}
                maxSize={20 * 1024 * 1024}
                className="w-24 h-24"
              />
            </div>

            <div>
              <h4 className="text-gray-500 text-base">Hero Image</h4>
              <FileUploader
                variant="tile"
                multiple={false}
                value={attachments.hero_image ? [attachments.hero_image] : []}
                onValueChange={(file) => {
                  handleResumeUpload("hero_image", file?.at(0));
                }}
                maxFileCount={1}
                maxSize={20 * 1024 * 1024}
                className="w-24 h-24"
              />
            </div>
            <div>
              <h4 className="text-gray-500 text-base">About Image</h4>
              <FileUploader
                variant="tile"
                multiple={false}
                value={attachments.about_image ? [attachments.about_image] : []}
                onValueChange={(file) => {
                  handleResumeUpload("about_image", file?.at(0));
                }}
                maxFileCount={1}
                maxSize={20 * 1024 * 1024}
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>
        {basicDetails?.avatar ? (
          <div className="relative p-4 w-28 h-28 rounded-full overflow-hidden border-2 bg-gray-100">
            <Image
              src={basicDetails?.avatar}
              alt="avatar"
              fill
              className="object-cover"
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
