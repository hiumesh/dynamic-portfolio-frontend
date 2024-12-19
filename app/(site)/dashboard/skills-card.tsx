"use client";

import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-context";
import { Chip } from "@nextui-org/react";
import SkillsFormModal from "./skills-form-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

export default function SkillsCard({ className }: { className?: string }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { profile, refreshProfile } = useAppContext();
  return (
    <div className={cn(" p-4 space-y-3", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button onClick={() => setIsFormVisible(true)}>
          <Edit2 /> Edit
        </Button>
      </div>
      <div className="flex gap-1 flex-wrap">
        {profile?.attributes?.skills?.map((skill) => (
          <Chip key={skill} variant="solid" color="secondary">
            {skill}
          </Chip>
        ))}
      </div>

      <SkillsFormModal
        isOpen={isFormVisible}
        hide={() => setIsFormVisible(false)}
        editData={profile?.attributes?.skills || []}
        onSuccess={() => refreshProfile()}
      />
    </div>
  );
}
