import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PropTypes {
  profile: UserProfile;
}

export default function ProfileCard({ profile }: PropTypes) {
  return (
    <div className="flex gap-5 items-center">
      <Avatar className="h-20 w-20 border-white border-4">
        <AvatarImage
          src={profile.avatar_url ? profile.avatar_url : undefined}
          alt={profile.full_name ? profile.full_name : undefined}
        />
        <AvatarFallback className="text-2xl opacity-70">
          {profile.full_name
            ?.trim()
            .split(" ")
            .map((w) => w[0]?.toUpperCase())
            .slice(0, 2)
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium">{profile.full_name}</h3>
        <p className="opacity-60 text-sm">
          {profile.attributes?.work_domains?.join(" • ")}
        </p>
        <p className="opacity-60 text-sm">
          {profile.attributes?.college} • {profile.attributes?.graduation_year}{" "}
          Pass out
        </p>
      </div>
      <Button>Edit</Button>
    </div>
  );
}
