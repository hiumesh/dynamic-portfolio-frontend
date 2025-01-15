"use client";

import { Button } from "@/components/ui/button";
import { get } from "@/services/api/portfolio";
import { Chip, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Edit3 } from "lucide-react";
import { useState } from "react";
import SkillsFormModal from "../skills-form-modal";

export default function SkillsSection() {
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

  const skills = data?.skills;

  if (error) return <></>;
  return (
    <section className="mx-4 border shadow rounded-md">
      <div className="flex items-center justify-between px-2 py-1 border-b">
        <h1 className="text-lg">Skills</h1>
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
      <div className="flex flex-wrap gap-2 p-2">
        {skills?.map((skill) => (
          <Chip key={skill} variant="solid" color="secondary">
            {skill}
          </Chip>
        ))}
      </div>
      <SkillsFormModal
        isOpen={form.visible}
        hide={() => setForm({ visible: false })}
        editData={skills || []}
        onSuccess={() => refetch()}
      />
    </section>
  );
}
